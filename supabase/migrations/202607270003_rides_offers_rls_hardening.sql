begin;

-- =========================================================
-- REMOVE CONFIRMED TEST DATA
-- =========================================================
--
-- These ten historical rides were explicitly confirmed as disposable test
-- data. Related offers are removed automatically through ON DELETE CASCADE.

delete from public.rides
where public_id in (
  'FL-KOH11Q',
  'FL-5BG7AM',
  'FL-QHWPJ5',
  'FL-LEPBG9',
  'FL-MSQMC3',
  'FL-UZ1TBO',
  'FL-FGVAVD',
  'FL-5QXQ6I',
  'FL-WBK5II',
  'FL-22OI09'
);

-- Stop if unexpected legacy data remains. This prevents constraints from
-- being installed over an inconsistent production data set.

do $$
begin
  if exists (
    select 1
    from public.offers o
    left join public.drivers d
      on d.id = o.driver_id
    where o.driver_id is null
       or d.id is null
  ) then
    raise exception
      'OFFERS_WITHOUT_VALID_DRIVER_REMAIN';
  end if;

  if exists (
    select 1
    from public.offers
    group by ride_id, driver_id
    having count(*) > 1
  ) then
    raise exception
      'DUPLICATE_DRIVER_RIDE_OFFERS_REMAIN';
  end if;
end;
$$;

-- =========================================================
-- DATA INTEGRITY
-- =========================================================

alter table public.offers
  alter column driver_id set not null;

alter table public.offers
  drop constraint if exists offers_driver_id_fkey;

alter table public.offers
  add constraint offers_driver_id_fkey
  foreign key (driver_id)
  references public.drivers(id)
  on delete restrict;

create unique index if not exists offers_ride_driver_unique_idx
  on public.offers(ride_id, driver_id);

create unique index if not exists rides_access_token_unique_idx
  on public.rides(access_token);

alter table public.offers
  drop constraint if exists offers_price_eur_check;

alter table public.offers
  add constraint offers_price_eur_check
  check (price_eur > 0 and price_eur <= 100000);

alter table public.offers
  drop constraint if exists offers_message_length_check;

alter table public.offers
  add constraint offers_message_length_check
  check (message is null or char_length(message) <= 500);

alter table public.offers
  drop constraint if exists offers_status_check;

alter table public.offers
  add constraint offers_status_check
  check (status in ('pending', 'accepted', 'rejected'));

alter table public.rides
  drop constraint if exists rides_status_check;

alter table public.rides
  add constraint rides_status_check
  check (status in ('open', 'confirmed', 'completed', 'cancelled'));

alter table public.rides
  drop constraint if exists rides_passengers_check;

alter table public.rides
  add constraint rides_passengers_check
  check (passengers between 1 and 100);

-- =========================================================
-- APPROVED DRIVER IDENTITY
-- =========================================================

create or replace function public.current_approved_driver_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select d.id
  from public.drivers d
  where d.auth_user_id = auth.uid()
    and d.verified is true
    and d.active is true
    and d.is_active is true
  limit 1;
$$;

revoke all on function public.current_approved_driver_id()
  from public, anon;

grant execute on function public.current_approved_driver_id()
  to authenticated, service_role;

-- =========================================================
-- ATOMIC CUSTOMER ACCEPTANCE
-- =========================================================
--
-- The customer is authorized by public_id + access_token at the server API.
-- Only the service role can execute this database transaction.

drop function if exists public.accept_falcon_proposal(text, text, text);
drop function if exists public.accept_falcon_proposal(text, text, uuid);

create function public.accept_falcon_proposal(
  p_public_id text,
  p_access_token text,
  p_proposal_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_ride public.rides%rowtype;
  selected_offer public.offers%rowtype;
begin
  if nullif(trim(p_public_id), '') is null
     or nullif(trim(p_access_token), '') is null
     or p_proposal_id is null then
    return jsonb_build_object(
      'success', false,
      'errorMessage', 'Ontbrekende of ongeldige gegevens.'
    );
  end if;

  select r.*
  into selected_ride
  from public.rides r
  where r.public_id = trim(p_public_id)
    and r.access_token = trim(p_access_token)
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'errorMessage', 'De transferaanvraag kon niet worden gevonden.'
    );
  end if;

  if selected_ride.status <> 'open' then
    return jsonb_build_object(
      'success', false,
      'errorMessage', 'Deze transferaanvraag is niet meer beschikbaar.'
    );
  end if;

  select o.*
  into selected_offer
  from public.offers o
  join public.drivers d
    on d.id = o.driver_id
  where o.id = p_proposal_id
    and o.ride_id = selected_ride.id
    and o.status = 'pending'
    and d.verified is true
    and d.active is true
    and d.is_active is true
  for update of o;

  if not found then
    return jsonb_build_object(
      'success', false,
      'errorMessage', 'Dit voorstel is niet meer beschikbaar.'
    );
  end if;

  update public.offers
  set status = case
    when id = selected_offer.id then 'accepted'
    else 'rejected'
  end
  where ride_id = selected_ride.id;

  update public.rides
  set
    status = 'confirmed',
    driver_id = selected_offer.driver_id
  where id = selected_ride.id;

  return jsonb_build_object(
    'success', true,
    'rideId', selected_ride.id,
    'offerId', selected_offer.id
  );
end;
$$;

revoke all on function public.accept_falcon_proposal(text, text, uuid)
  from public, anon, authenticated;

grant execute on function public.accept_falcon_proposal(text, text, uuid)
  to service_role;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.rides enable row level security;
alter table public.offers enable row level security;

drop policy if exists "Approved drivers can view marketplace rides"
  on public.rides;

create policy "Approved drivers can view marketplace rides"
on public.rides
for select
to authenticated
using (
  public.current_approved_driver_id() is not null
  and (
    (status = 'open' and driver_id is null)
    or driver_id = public.current_approved_driver_id()
  )
);

drop policy if exists "Approved drivers can view their own offers"
  on public.offers;

create policy "Approved drivers can view their own offers"
on public.offers
for select
to authenticated
using (
  driver_id = public.current_approved_driver_id()
);

drop policy if exists "Approved drivers can create their own offers"
  on public.offers;

create policy "Approved drivers can create their own offers"
on public.offers
for insert
to authenticated
with check (
  driver_id = public.current_approved_driver_id()
  and status = 'pending'
  and price_eur > 0
  and price_eur <= 100000
  and (message is null or char_length(message) <= 500)
  and exists (
    select 1
    from public.rides r
    where r.id = ride_id
      and r.status = 'open'
      and r.driver_id is null
  )
);

-- =========================================================
-- LEAST-PRIVILEGE TABLE GRANTS
-- =========================================================
--
-- Open marketplace reads intentionally exclude customer_name, phone, email
-- and access_token. Assigned-trip contact data is loaded through an
-- authorized server-only helper instead.

revoke all on table public.rides
  from anon, authenticated;
revoke all on table public.offers
  from anon, authenticated;

grant select (
  id,
  public_id,
  pickup_location,
  dropoff_location,
  flight_number,
  passengers,
  scheduled_at,
  customer_note,
  status,
  created_at,
  driver_id
) on table public.rides
  to authenticated;

grant select on table public.offers
  to authenticated;

grant insert (
  ride_id,
  driver_id,
  price_eur,
  message,
  status
) on table public.offers
  to authenticated;

commit;
