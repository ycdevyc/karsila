begin;

-- =========================================================
-- IMMUTABLE ADMIN REVIEW LOG
-- =========================================================

create table if not exists public.driver_application_reviews (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null
    references public.drivers(id)
    on delete restrict,
  admin_auth_user_id uuid not null
    references auth.users(id)
    on delete restrict,
  action text not null
    check (action in ('approved', 'rejected', 'suspended')),
  previous_status text,
  resulting_status text not null,
  note text,
  created_at timestamp with time zone not null default now()
);

create index if not exists driver_application_reviews_driver_created_idx
  on public.driver_application_reviews(driver_id, created_at desc);

create index if not exists driver_application_reviews_admin_created_idx
  on public.driver_application_reviews(admin_auth_user_id, created_at desc);

alter table public.driver_application_reviews
  enable row level security;

revoke all on table public.driver_application_reviews
  from public, anon, authenticated;

grant select, insert on table public.driver_application_reviews
  to service_role;

-- =========================================================
-- ATOMIC DRIVER REVIEW
-- =========================================================

drop function if exists public.review_driver_application(
  uuid,
  text,
  uuid,
  text
);

create function public.review_driver_application(
  p_driver_id uuid,
  p_action text,
  p_admin_auth_user_id uuid,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_driver public.drivers%rowtype;
  normalized_action text;
  normalized_note text;
  resulting_status text;
  required_document_count integer;
  vehicle_count integer;
begin
  normalized_action := lower(trim(coalesce(p_action, '')));
  normalized_note := nullif(trim(coalesce(p_note, '')), '');

  if normalized_action not in ('approve', 'reject', 'suspend') then
    return jsonb_build_object(
      'success', false,
      'code', 'INVALID_ACTION',
      'message', 'Unsupported review action.'
    );
  end if;

  if not exists (
    select 1
    from auth.users u
    where u.id = p_admin_auth_user_id
      and u.raw_app_meta_data ->> 'role' = 'admin'
  ) then
    return jsonb_build_object(
      'success', false,
      'code', 'ADMIN_ACCESS_REQUIRED',
      'message', 'Administrator access is required.'
    );
  end if;

  if normalized_action in ('reject', 'suspend')
     and normalized_note is null then
    return jsonb_build_object(
      'success', false,
      'code', 'REVIEW_NOTE_REQUIRED',
      'message', 'Add a reason before continuing.'
    );
  end if;

  if normalized_note is not null
     and char_length(normalized_note) > 2000 then
    return jsonb_build_object(
      'success', false,
      'code', 'REVIEW_NOTE_TOO_LONG',
      'message', 'The review note is too long.'
    );
  end if;

  select d.*
  into selected_driver
  from public.drivers d
  where d.id = p_driver_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'code', 'DRIVER_NOT_FOUND',
      'message', 'The driver application could not be found.'
    );
  end if;

  if normalized_action = 'approve' then
    select count(distinct dd.document_type)
    into required_document_count
    from public.driver_documents dd
    where dd.driver_id = p_driver_id
      and dd.document_type in (
        'driver_license',
        'commercial_driver_license',
        'vehicle_registration',
        'vehicle_insurance'
      );

    select count(*)
    into vehicle_count
    from public.vehicles v
    where v.driver_id = p_driver_id;

    if required_document_count <> 4 then
      return jsonb_build_object(
        'success', false,
        'code', 'REQUIRED_DOCUMENTS_MISSING',
        'message', 'All required documents must be present before approval.'
      );
    end if;

    if vehicle_count < 1 then
      return jsonb_build_object(
        'success', false,
        'code', 'VEHICLE_MISSING',
        'message', 'A registered vehicle is required before approval.'
      );
    end if;

    resulting_status := 'approved';

    update public.drivers
    set
      application_status = resulting_status,
      application_reviewed_at = now(),
      application_review_note = normalized_note,
      rejected_reason = null,
      verified = true,
      active = true,
      is_active = true
    where id = p_driver_id;

    update public.vehicles
    set
      verified = true,
      active = true,
      updated_at = now()
    where driver_id = p_driver_id;

    update public.driver_documents
    set
      verification_status = 'approved',
      verified = true,
      rejection_reason = null,
      reviewed_at = now(),
      updated_at = now()
    where driver_id = p_driver_id;
  elsif normalized_action = 'reject' then
    resulting_status := 'rejected';

    update public.drivers
    set
      application_status = resulting_status,
      application_reviewed_at = now(),
      application_review_note = normalized_note,
      rejected_reason = normalized_note,
      verified = false,
      active = false,
      is_active = false
    where id = p_driver_id;

    update public.vehicles
    set
      verified = false,
      active = false,
      updated_at = now()
    where driver_id = p_driver_id;

    update public.driver_documents
    set
      verification_status = 'rejected',
      verified = false,
      rejection_reason = normalized_note,
      reviewed_at = now(),
      updated_at = now()
    where driver_id = p_driver_id;
  else
    resulting_status := 'suspended';

    update public.drivers
    set
      application_status = resulting_status,
      application_reviewed_at = now(),
      application_review_note = normalized_note,
      active = false,
      is_active = false
    where id = p_driver_id;

    update public.vehicles
    set
      active = false,
      updated_at = now()
    where driver_id = p_driver_id;
  end if;

  insert into public.driver_application_reviews (
    driver_id,
    admin_auth_user_id,
    action,
    previous_status,
    resulting_status,
    note
  )
  values (
    p_driver_id,
    p_admin_auth_user_id,
    case normalized_action
      when 'approve' then 'approved'
      when 'reject' then 'rejected'
      else 'suspended'
    end,
    selected_driver.application_status,
    resulting_status,
    normalized_note
  );

  return jsonb_build_object(
    'success', true,
    'driverId', p_driver_id,
    'status', resulting_status
  );
end;
$$;

revoke all on function public.review_driver_application(
  uuid,
  text,
  uuid,
  text
) from public, anon, authenticated;

grant execute on function public.review_driver_application(
  uuid,
  text,
  uuid,
  text
) to service_role;

commit;
