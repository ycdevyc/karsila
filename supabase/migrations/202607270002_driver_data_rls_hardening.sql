begin;

-- Keep normalized identity fields consistent when a profile or vehicle is
-- edited outside the onboarding RPC.

create or replace function public.sync_driver_normalized_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.email_normalized := case
    when new.email is null then null
    else public.normalize_email(new.email)
  end;

  new.phone_normalized := case
    when new.phone is null then null
    else public.normalize_phone(new.phone)
  end;

  return new;
end;
$$;

drop trigger if exists drivers_sync_normalized_fields
  on public.drivers;

create trigger drivers_sync_normalized_fields
before insert or update of email, phone
on public.drivers
for each row
execute function public.sync_driver_normalized_fields();

create or replace function public.sync_vehicle_normalized_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.license_plate_normalized := case
    when new.license_plate is null then null
    else public.normalize_license_plate(new.license_plate)
  end;

  return new;
end;
$$;

drop trigger if exists vehicles_sync_normalized_fields
  on public.vehicles;

create trigger vehicles_sync_normalized_fields
before insert or update of license_plate
on public.vehicles
for each row
execute function public.sync_vehicle_normalized_fields();

-- The customer request portal now reads these tables exclusively through
-- the server-only service-role client after validating public_id + token.
-- Browser roles therefore no longer need direct access to all driver data.

alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.driver_documents enable row level security;

drop policy if exists "Drivers can view their own profile"
  on public.drivers;
drop policy if exists "Drivers can update their own profile"
  on public.drivers;

create policy "Drivers can view their own profile"
on public.drivers
for select
to authenticated
using (auth_user_id = auth.uid());

create policy "Drivers can update their own profile"
on public.drivers
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "Drivers can view their own vehicles"
  on public.vehicles;
drop policy if exists "Drivers can insert their own vehicles"
  on public.vehicles;
drop policy if exists "Drivers can update their own vehicles"
  on public.vehicles;
drop policy if exists "Drivers can delete their own vehicles"
  on public.vehicles;
drop policy if exists "Drivers can delete their own unverified vehicles"
  on public.vehicles;

create policy "Drivers can view their own vehicles"
on public.vehicles
for select
to authenticated
using (driver_id = public.current_driver_id());

drop policy if exists "Drivers can view their own documents"
  on public.driver_documents;
drop policy if exists "Drivers can insert their own documents"
  on public.driver_documents;
drop policy if exists "Drivers can update their own pending documents"
  on public.driver_documents;
drop policy if exists "Drivers can delete their own pending documents"
  on public.driver_documents;

create policy "Drivers can view their own documents"
on public.driver_documents
for select
to authenticated
using (driver_id = public.current_driver_id());

-- Remove broad table privileges. RLS does not protect operations such as
-- TRUNCATE, so those privileges must be revoked explicitly as well.

revoke all on table public.drivers
  from anon, authenticated;
revoke all on table public.vehicles
  from anon, authenticated;
revoke all on table public.driver_documents
  from anon, authenticated;

grant select on table public.drivers
  to authenticated;

grant update (
  name,
  full_name,
  phone,
  phone_normalized,
  languages,
  vehicle_id,
  profile_photo
) on table public.drivers
  to authenticated;

grant select on table public.vehicles
  to authenticated;

grant select on table public.driver_documents
  to authenticated;

-- Document uploads and mutations are handled by audited server routes.
-- Authenticated browser sessions may only read their private files.

drop policy if exists "Drivers can upload onboarding documents"
  on storage.objects;
drop policy if exists "Drivers can view onboarding documents"
  on storage.objects;
drop policy if exists "Drivers can replace onboarding documents"
  on storage.objects;
drop policy if exists "Drivers can delete onboarding documents"
  on storage.objects;

create policy "Drivers can view onboarding documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'driver-documents'
  and (storage.foldername(name))[1] =
    public.current_driver_id()::text
);

-- Trigger helpers are internal implementation details.

revoke all on function public.sync_driver_normalized_fields()
  from public, anon, authenticated;
revoke all on function public.sync_vehicle_normalized_fields()
  from public, anon, authenticated;

commit;
