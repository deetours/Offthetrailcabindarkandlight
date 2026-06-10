-- Wanderpals Multi-Tenant PMS Foundation
-- Apply after the base Supabase bootstrap scripts.
-- Safe to rerun where possible.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  organization_type text not null default 'brand',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text unique,
  property_type text not null default 'homestay',
  region text,
  city text,
  state text,
  country text not null default 'India',
  cover_image_url text,
  description text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  scope text not null default 'property',
  role text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_memberships_scope_check check (scope in ('organization', 'property')),
  constraint property_memberships_status_check check (status in ('active', 'inactive'))
);

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  slug text,
  base_price numeric(10, 2) not null default 0,
  capacity integer not null default 2,
  inventory_count integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete set null,
  name text not null,
  room_status text not null default 'vacant_clean',
  capacity integer not null default 2,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_status_check check (
    room_status in ('vacant_clean', 'vacant_dirty', 'occupied', 'out_of_order', 'blocked')
  )
);

create table if not exists public.room_inventory (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  date date not null,
  available_count integer not null default 0,
  blocked_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_inventory_unique unique (room_type_id, date)
);

create table if not exists public.room_rate_plans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  name text not null,
  currency text not null default 'INR',
  nightly_rate numeric(10, 2) not null,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blackout_dates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_departures (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  start_date date not null,
  end_date date not null,
  capacity_total integer not null default 0,
  capacity_reserved integer not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_inventory (
  id uuid primary key default gen_random_uuid(),
  trip_departure_id uuid not null references public.trip_departures(id) on delete cascade,
  seats_held integer not null default 0,
  seats_reserved integer not null default 0,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guest_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  gst_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings
  add column if not exists organization_id uuid references public.organizations(id) on delete set null,
  add column if not exists property_id uuid references public.properties(id) on delete set null,
  add column if not exists product_type text default 'trip',
  add column if not exists booking_type text default 'trip',
  add column if not exists room_type_id uuid references public.room_types(id) on delete set null,
  add column if not exists room_id uuid references public.rooms(id) on delete set null,
  add column if not exists trip_departure_id uuid references public.trip_departures(id) on delete set null,
  add column if not exists check_in date,
  add column if not exists check_out date,
  add column if not exists guests_count integer default 1,
  add column if not exists guest_count integer default 1,
  add column if not exists quantity integer default 1,
  add column if not exists currency text default 'INR',
  add column if not exists subtotal_amount numeric(10, 2) default 0,
  add column if not exists tax_amount numeric(10, 2) default 0,
  add column if not exists quote_snapshot jsonb default '{}'::jsonb,
  add column if not exists booking_status text default 'pending_payment',
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists hold_expires_at timestamptz,
  add column if not exists confirmed_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text;

create table if not exists public.booking_holds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  product_type text not null check (product_type in ('stay', 'trip')),
  property_id uuid references public.properties(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  trip_departure_id uuid references public.trip_departures(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  check_in date,
  check_out date,
  status text not null default 'active'
    check (status in ('active', 'expired', 'released', 'converted')),
  hold_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_guests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  guest_profile_id uuid references public.guest_profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  amount numeric(10, 2) not null,
  currency text not null default 'INR',
  payment_gateway text not null default 'razorpay',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text not null default 'created',
  method text,
  error_code text,
  error_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text,
  event_type text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payload jsonb not null,
  processed boolean not null default false,
  processing_error text,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  checked_in_by uuid references auth.users(id) on delete set null,
  checked_in_at timestamptz not null default now(),
  notes text
);

create table if not exists public.checkouts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  checked_out_by uuid references auth.users(id) on delete set null,
  checked_out_at timestamptz not null default now(),
  notes text
);

create table if not exists public.housekeeping_tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  title text not null,
  status text not null default 'pending',
  due_date timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint housekeeping_status_check check (
    status in ('pending', 'in_progress', 'done', 'inspection_required')
  )
);

create table if not exists public.maintenance_tickets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tax_profiles (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  legal_name text not null,
  gst_number text,
  billing_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  invoice_number text not null unique,
  subtotal_amount numeric(10, 2) not null default 0,
  tax_amount numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null default 0,
  invoice_status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owner_payouts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  period_start date not null,
  period_end date not null,
  gross_amount numeric(10, 2) not null default 0,
  net_amount numeric(10, 2) not null default 0,
  payout_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_properties_org on public.properties(organization_id);
create index if not exists idx_property_memberships_user on public.property_memberships(user_id);
create index if not exists idx_property_memberships_property on public.property_memberships(property_id);
create index if not exists idx_room_types_property on public.room_types(property_id);
create index if not exists idx_rooms_property on public.rooms(property_id);
create index if not exists idx_room_inventory_property_date on public.room_inventory(property_id, date);
create index if not exists idx_trip_departures_trip on public.trip_departures(trip_id);
create index if not exists idx_bookings_property on public.bookings(property_id);
create index if not exists idx_bookings_hold_expires_at on public.bookings(hold_expires_at);
create index if not exists idx_bookings_status on public.bookings(booking_status, payment_status);
create index if not exists idx_payments_booking on public.payments(booking_id);
create index if not exists idx_booking_holds_booking_id on public.booking_holds(booking_id);
create index if not exists idx_booking_holds_property_dates on public.booking_holds(property_id, room_type_id, check_in, check_out, status);
create index if not exists idx_booking_holds_trip_departure on public.booking_holds(trip_departure_id, status);
create index if not exists idx_booking_holds_expiry on public.booking_holds(hold_expires_at, status);
create unique index if not exists idx_payment_webhook_events_provider_event_id
  on public.payment_webhook_events(provider, event_id)
  where event_id is not null;
create index if not exists idx_housekeeping_property on public.housekeeping_tasks(property_id);
create index if not exists idx_audit_logs_property on public.audit_logs(property_id);

insert into public.organizations (name, slug, organization_type, status)
select 'Wanderpals', 'wanderpals', 'brand', 'active'
where not exists (
  select 1 from public.organizations where slug = 'wanderpals'
);

create or replace function public.has_property_access(target_property_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    public.is_admin()
    or exists (
      select 1
      from public.property_memberships membership
      where membership.user_id = auth.uid()
        and membership.status = 'active'
        and membership.property_id = target_property_id
    );
$$;

grant execute on function public.has_property_access(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.properties enable row level security;
alter table public.property_memberships enable row level security;
alter table public.room_types enable row level security;
alter table public.rooms enable row level security;
alter table public.room_inventory enable row level security;
alter table public.room_rate_plans enable row level security;
alter table public.blackout_dates enable row level security;
alter table public.trip_departures enable row level security;
alter table public.trip_inventory enable row level security;
alter table public.booking_holds enable row level security;
alter table public.booking_guests enable row level security;
alter table public.payments enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.guest_profiles enable row level security;
alter table public.checkins enable row level security;
alter table public.checkouts enable row level security;
alter table public.housekeeping_tasks enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.tax_profiles enable row level security;
alter table public.invoices enable row level security;
alter table public.owner_payouts enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "properties_public_read" on public.properties;
create policy "properties_public_read"
on public.properties for select
to anon, authenticated
using (status = 'published');

drop policy if exists "properties_member_read" on public.properties;
create policy "properties_member_read"
on public.properties for select
to authenticated
using (public.has_property_access(id));

drop policy if exists "properties_admin_all" on public.properties;
create policy "properties_admin_all"
on public.properties for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "property_memberships_self_or_admin" on public.property_memberships;
create policy "property_memberships_self_or_admin"
on public.property_memberships for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "property_memberships_admin_all" on public.property_memberships;
create policy "property_memberships_admin_all"
on public.property_memberships for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "room_types_property_access" on public.room_types;
create policy "room_types_property_access"
on public.room_types for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "rooms_property_access" on public.rooms;
create policy "rooms_property_access"
on public.rooms for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "room_inventory_property_access" on public.room_inventory;
create policy "room_inventory_property_access"
on public.room_inventory for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "room_rate_plans_property_access" on public.room_rate_plans;
create policy "room_rate_plans_property_access"
on public.room_rate_plans for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "blackout_dates_property_access" on public.blackout_dates;
create policy "blackout_dates_property_access"
on public.blackout_dates for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "trip_departures_property_access" on public.trip_departures;
create policy "trip_departures_property_access"
on public.trip_departures for all
to authenticated
using (property_id is null or public.has_property_access(property_id))
with check (property_id is null or public.has_property_access(property_id));

drop policy if exists "bookings_property_member_read" on public.bookings;
create policy "bookings_property_member_read"
on public.bookings for select
to authenticated
using (
  auth.uid() = user_id
  or (property_id is not null and public.has_property_access(property_id))
  or public.is_admin()
);

drop policy if exists "bookings_property_member_update" on public.bookings;
create policy "bookings_property_member_update"
on public.bookings for update
to authenticated
using (
  auth.uid() = user_id
  or (property_id is not null and public.has_property_access(property_id))
  or public.is_admin()
)
with check (
  auth.uid() = user_id
  or (property_id is not null and public.has_property_access(property_id))
  or public.is_admin()
);

drop policy if exists "booking_holds_property_member_read" on public.booking_holds;
create policy "booking_holds_property_member_read"
on public.booking_holds for select
to authenticated
using (
  exists (
    select 1
    from public.bookings booking
    where booking.id = booking_holds.booking_id
      and (
        booking.user_id = auth.uid()
        or (booking_holds.property_id is not null and public.has_property_access(booking_holds.property_id))
        or public.is_admin()
      )
  )
);

drop policy if exists "booking_holds_admin_all" on public.booking_holds;
create policy "booking_holds_admin_all"
on public.booking_holds for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payments_property_member_read" on public.payments;
create policy "payments_property_member_read"
on public.payments for select
to authenticated
using (
  property_id is not null and public.has_property_access(property_id)
  or public.is_admin()
);

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all"
on public.payments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payment_webhook_events_admin_read" on public.payment_webhook_events;
create policy "payment_webhook_events_admin_read"
on public.payment_webhook_events for select
to authenticated
using (public.is_admin());

drop policy if exists "payment_webhook_events_admin_all" on public.payment_webhook_events;
create policy "payment_webhook_events_admin_all"
on public.payment_webhook_events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "housekeeping_property_access" on public.housekeeping_tasks;
create policy "housekeeping_property_access"
on public.housekeeping_tasks for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "maintenance_property_access" on public.maintenance_tickets;
create policy "maintenance_property_access"
on public.maintenance_tickets for all
to authenticated
using (public.has_property_access(property_id))
with check (public.has_property_access(property_id));

drop policy if exists "invoices_property_access" on public.invoices;
create policy "invoices_property_access"
on public.invoices for all
to authenticated
using (property_id is not null and public.has_property_access(property_id) or public.is_admin())
with check (property_id is not null and public.has_property_access(property_id) or public.is_admin());

drop policy if exists "owner_payouts_property_access" on public.owner_payouts;
create policy "owner_payouts_property_access"
on public.owner_payouts for all
to authenticated
using (public.has_property_access(property_id) or public.is_admin())
with check (public.has_property_access(property_id) or public.is_admin());

drop policy if exists "audit_logs_property_access" on public.audit_logs;
create policy "audit_logs_property_access"
on public.audit_logs for select
to authenticated
using (property_id is not null and public.has_property_access(property_id) or public.is_admin());
