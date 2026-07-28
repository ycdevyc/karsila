begin;

-- Falcon driver onboarding must produce either one complete pending
-- application or no database records at all. Auth and Storage cleanup
-- remains the responsibility of the server route because those systems
-- cannot participate in this PostgreSQL transaction.

create or replace function public.normalize_email(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select lower(trim(coalesce(value, '')));
$$;

create or replace function public.normalize_phone(value text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  cleaned text;
begin
  cleaned := regexp_replace(
    trim(coalesce(value, '')),
    '[^0-9+]',
    '',
    'g'
  );

  if cleaned like '00%' then
    cleaned := '+' || substring(cleaned from 3);
  end if;

  return cleaned;
end;
$$;

create or replace function public.normalize_license_plate(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(
    upper(trim(coalesce(value, ''))),
    '[^A-Z0-9]',
    '',
    'g'
  );
$$;

alter table public.drivers
  add column if not exists email text,
  add column if not exists email_normalized text,
  add column if not exists phone_normalized text;

alter table public.vehicles
  add column if not exists license_plate_normalized text;

update public.drivers
set
  email_normalized = case
    when email is null then null
    else public.normalize_email(email)
  end,
  phone_normalized = case
    when phone is null then null
    else public.normalize_phone(phone)
  end;

update public.vehicles
set license_plate_normalized = case
  when license_plate is null then null
  else public.normalize_license_plate(license_plate)
end;

create unique index if not exists drivers_auth_user_id_unique_idx
  on public.drivers(auth_user_id)
  where auth_user_id is not null;

create unique index if not exists drivers_email_normalized_unique_idx
  on public.drivers(email_normalized)
  where email_normalized is not null
    and email_normalized <> '';

create unique index if not exists drivers_phone_normalized_unique_idx
  on public.drivers(phone_normalized)
  where phone_normalized is not null
    and phone_normalized <> '';

create unique index if not exists vehicles_license_plate_normalized_unique_idx
  on public.vehicles(license_plate_normalized)
  where license_plate_normalized is not null
    and license_plate_normalized <> '';

-- New drivers must never become active through a column default.
alter table public.drivers
  alter column verified set default false,
  alter column active set default false,
  alter column is_active set default false,
  alter column application_status set default 'pending';

create or replace function public.check_driver_registration_uniqueness(
  p_email text default null,
  p_phone text default null,
  p_license_plate text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text;
  normalized_phone text;
  normalized_plate text;
begin
  normalized_email := case
    when p_email is null then null
    else public.normalize_email(p_email)
  end;

  normalized_phone := case
    when p_phone is null then null
    else public.normalize_phone(p_phone)
  end;

  normalized_plate := case
    when p_license_plate is null then null
    else public.normalize_license_plate(p_license_plate)
  end;

  return jsonb_build_object(
    'emailTaken',
    coalesce(
      normalized_email <> ''
      and exists (
        select 1
        from auth.users
        where lower(email) = normalized_email
      ),
      false
    ),
    'phoneTaken',
    coalesce(
      normalized_phone <> ''
      and exists (
        select 1
        from public.drivers
        where phone_normalized = normalized_phone
      ),
      false
    ),
    'licensePlateTaken',
    coalesce(
      normalized_plate <> ''
      and exists (
        select 1
        from public.vehicles
        where license_plate_normalized = normalized_plate
      ),
      false
    )
  );
end;
$$;

create or replace function public.create_driver_application(
  p_driver_id uuid,
  p_auth_user_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_languages text,
  p_company_name text,
  p_vat_number text,
  p_country text,
  p_city text,
  p_airport_region text,
  p_vehicle_id uuid,
  p_vehicle_brand text,
  p_vehicle_model text,
  p_vehicle_year integer,
  p_vehicle_license_plate text,
  p_vehicle_color text,
  p_vehicle_capacity integer,
  p_vehicle_luggage_capacity integer,
  p_documents jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := public.normalize_email(p_email);
  normalized_phone text := public.normalize_phone(p_phone);
  normalized_plate text := public.normalize_license_plate(
    p_vehicle_license_plate
  );
  required_document_types constant text[] := array[
    'driver_license',
    'commercial_driver_license',
    'vehicle_registration',
    'vehicle_insurance'
  ];
  document jsonb;
begin
  if p_auth_user_id is null then
    raise exception using message = 'AUTH_USER_REQUIRED';
  end if;

  if nullif(trim(p_full_name), '') is null then
    raise exception using message = 'FULL_NAME_REQUIRED';
  end if;

  if normalized_email = '' then
    raise exception using message = 'INVALID_EMAIL';
  end if;

  if normalized_phone = '' then
    raise exception using message = 'INVALID_PHONE';
  end if;

  if nullif(trim(p_languages), '') is null then
    raise exception using message = 'LANGUAGES_REQUIRED';
  end if;

  if nullif(trim(p_country), '') is null
    or nullif(trim(p_city), '') is null
    or nullif(trim(p_airport_region), '') is null then
    raise exception using message = 'OPERATING_DETAILS_REQUIRED';
  end if;

  if nullif(trim(p_vehicle_brand), '') is null
    or nullif(trim(p_vehicle_model), '') is null then
    raise exception using message = 'VEHICLE_REQUIRED';
  end if;

  if p_vehicle_year < 1990 or p_vehicle_year > 2100 then
    raise exception using message = 'INVALID_VEHICLE_YEAR';
  end if;

  if normalized_plate = '' then
    raise exception using message = 'LICENSE_PLATE_REQUIRED';
  end if;

  if p_vehicle_capacity < 1 or p_vehicle_capacity > 100 then
    raise exception using message = 'INVALID_CAPACITY';
  end if;

  if p_vehicle_luggage_capacity < 0
    or p_vehicle_luggage_capacity > 100 then
    raise exception using message = 'INVALID_LUGGAGE_CAPACITY';
  end if;

  if jsonb_typeof(p_documents) <> 'array'
    or jsonb_array_length(p_documents) <> 4 then
    raise exception using message = 'INVALID_DOCUMENT_SET';
  end if;

  if (
    select count(distinct item->>'documentType')
    from jsonb_array_elements(p_documents) as item
    where item->>'documentType' = any(required_document_types)
      and nullif(item->>'fileName', '') is not null
      and nullif(item->>'filePath', '') is not null
      and nullif(item->>'mimeType', '') is not null
      and coalesce((item->>'fileSizeBytes')::bigint, 0) > 0
  ) <> 4 then
    raise exception using message = 'INVALID_DOCUMENT_SET';
  end if;

  if exists (
    select 1
    from public.drivers
    where auth_user_id = p_auth_user_id
  ) then
    raise exception using message = 'AUTH_USER_ALREADY_LINKED';
  end if;

  if exists (
    select 1
    from public.drivers
    where email_normalized = normalized_email
  ) then
    raise exception using message = 'EMAIL_ALREADY_EXISTS';
  end if;

  if exists (
    select 1
    from public.drivers
    where phone_normalized = normalized_phone
  ) then
    raise exception using message = 'PHONE_ALREADY_EXISTS';
  end if;

  if exists (
    select 1
    from public.vehicles
    where license_plate_normalized = normalized_plate
  ) then
    raise exception using message = 'LICENSE_PLATE_ALREADY_EXISTS';
  end if;

  insert into public.drivers (
    id,
    auth_user_id,
    full_name,
    name,
    email,
    email_normalized,
    phone,
    phone_normalized,
    languages,
    company_name,
    vat_number,
    country,
    city,
    airport_region,
    verified,
    active,
    is_active,
    application_status,
    application_submitted_at
  )
  values (
    p_driver_id,
    p_auth_user_id,
    trim(p_full_name),
    trim(p_full_name),
    trim(p_email),
    normalized_email,
    trim(p_phone),
    normalized_phone,
    trim(p_languages),
    nullif(trim(p_company_name), ''),
    nullif(trim(p_vat_number), ''),
    trim(p_country),
    trim(p_city),
    trim(p_airport_region),
    false,
    false,
    false,
    'pending',
    now()
  );

  insert into public.vehicles (
    id,
    driver_id,
    name,
    brand,
    model,
    production_year,
    license_plate,
    license_plate_normalized,
    color,
    capacity,
    luggage_capacity,
    verified,
    active
  )
  values (
    p_vehicle_id,
    p_driver_id,
    trim(p_vehicle_brand) || ' ' || trim(p_vehicle_model),
    trim(p_vehicle_brand),
    trim(p_vehicle_model),
    p_vehicle_year,
    upper(trim(p_vehicle_license_plate)),
    normalized_plate,
    nullif(trim(p_vehicle_color), ''),
    p_vehicle_capacity,
    p_vehicle_luggage_capacity,
    false,
    true
  );

  update public.drivers
  set vehicle_id = p_vehicle_id
  where id = p_driver_id;

  for document in
    select value
    from jsonb_array_elements(p_documents)
  loop
    insert into public.driver_documents (
      driver_id,
      document_type,
      file_name,
      file_path,
      file_url,
      mime_type,
      file_size_bytes,
      verification_status,
      verified
    )
    values (
      p_driver_id,
      document->>'documentType',
      document->>'fileName',
      document->>'filePath',
      null,
      document->>'mimeType',
      (document->>'fileSizeBytes')::bigint,
      'pending',
      false
    );
  end loop;

  return jsonb_build_object(
    'success', true,
    'driverId', p_driver_id,
    'vehicleId', p_vehicle_id
  );
end;
$$;

-- Remove PostgreSQL's default PUBLIC execute privilege and every explicit
-- client-role grant found during the production schema audit.
revoke all on function public.check_driver_registration_uniqueness(
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.check_driver_registration_uniqueness(
  text,
  text,
  text
) to service_role;

revoke all on function public.create_driver_application(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  uuid,
  text,
  text,
  integer,
  text,
  text,
  integer,
  integer,
  jsonb
) from public, anon, authenticated;

grant execute on function public.create_driver_application(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  uuid,
  text,
  text,
  integer,
  text,
  text,
  integer,
  integer,
  jsonb
) to service_role;

revoke all on function public.current_driver_id()
  from public, anon;

grant execute on function public.current_driver_id()
  to authenticated, service_role;

commit;
