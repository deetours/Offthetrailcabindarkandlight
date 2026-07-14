-- Offthetrail Supabase bootstrap for a fresh project
-- Run this in the Supabase SQL editor for the new project.
-- Safe to rerun: tables, policies, functions, and triggers are created idempotently where possible.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp_number text,
  avatar_url text,
  role text not null default 'user',
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  description text,
  region text,
  terrain text,
  duration integer,
  price numeric(10, 2) default 0,
  group_size integer default 0,
  status text not null default 'draft',
  image_url text,
  is_featured boolean not null default false,
  show_on_all_trips boolean not null default true,
  show_on_journeys boolean not null default false,
  itinerary jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  terms jsonb not null default '[]'::jsonb,
  things_to_carry jsonb not null default '[]'::jsonb,
  dates jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  tagline text,
  description text,
  price numeric(10, 2) default 0,
  room_type text,
  capacity integer default 0,
  status text not null default 'draft',
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  stay_id uuid references public.stays(id) on delete set null,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  total_amount numeric(10, 2) not null default 0,
  whatsapp_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone_number text,
  source text,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  type text not null default 'trip',
  content text,
  media_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_likes (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint memory_likes_memory_user_unique unique (memory_id, user_id)
);

create table if not exists public.memory_comments (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.story_likes (
  id uuid primary key default gen_random_uuid(),
  story_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint story_likes_story_user_unique unique (story_id, user_id)
);

create table if not exists public.story_comments (
  id uuid primary key default gen_random_uuid(),
  story_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_trip_id on public.bookings(trip_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_memories_trip_id on public.memories(trip_id);
create index if not exists idx_memory_comments_memory_id on public.memory_comments(memory_id);
create index if not exists idx_memory_likes_memory_id on public.memory_likes(memory_id);

-- ---------------------------------------------------------------------------
-- Core admin helper function
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  ) or exists (
    select 1
    from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Auth trigger
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp_number, avatar_url, role, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'whatsapp_number',
    new.raw_user_meta_data->>'avatar_url',
    'user',
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    whatsapp_number = coalesce(excluded.whatsapp_number, public.profiles.whatsapp_number),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  insert into public.users (id, email, role, onboarding_complete, created_at, updated_at)
  values (
    new.id,
    new.email,
    'user',
    false,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, whatsapp_number, avatar_url, role, updated_at)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', au.email),
  au.raw_user_meta_data->>'whatsapp_number',
  au.raw_user_meta_data->>'avatar_url',
  'user',
  now()
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
);

insert into public.users (id, email, role, onboarding_complete, created_at, updated_at)
select
  au.id,
  au.email,
  'user',
  false,
  now(),
  now()
from auth.users au
where not exists (
  select 1 from public.users u where u.id = au.id
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.stays enable row level security;
alter table public.bookings enable row level security;
alter table public.leads enable row level security;
alter table public.memories enable row level security;
alter table public.memory_likes enable row level security;
alter table public.memory_comments enable row level security;
alter table public.story_likes enable row level security;
alter table public.story_comments enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
on public.profiles for select
to authenticated
using (public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users_select_admin" on public.users;
create policy "users_select_admin"
on public.users for select
to authenticated
using (public.is_admin());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "users_update_admin" on public.users;
create policy "users_update_admin"
on public.users for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "trips_public_read" on public.trips;
create policy "trips_public_read"
on public.trips for select
to anon, authenticated
using (status = 'published');

drop policy if exists "trips_admin_all" on public.trips;
create policy "trips_admin_all"
on public.trips for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "stays_public_read" on public.stays;
create policy "stays_public_read"
on public.stays for select
to anon, authenticated
using (status = 'published');

drop policy if exists "stays_admin_all" on public.stays;
create policy "stays_admin_all"
on public.stays for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
on public.bookings for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bookings_admin_all" on public.bookings;
create policy "bookings_admin_all"
on public.bookings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert"
on public.leads for insert
to anon, authenticated
with check (true);

drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all"
on public.leads for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "memories_authenticated_read" on public.memories;
create policy "memories_authenticated_read"
on public.memories for select
to authenticated
using (true);

drop policy if exists "memories_insert_own" on public.memories;
create policy "memories_insert_own"
on public.memories for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "memories_update_own" on public.memories;
create policy "memories_update_own"
on public.memories for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "memories_delete_own" on public.memories;
create policy "memories_delete_own"
on public.memories for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "memory_likes_read_authenticated" on public.memory_likes;
create policy "memory_likes_read_authenticated"
on public.memory_likes for select
to authenticated
using (true);

drop policy if exists "memory_likes_insert_own" on public.memory_likes;
create policy "memory_likes_insert_own"
on public.memory_likes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "memory_likes_delete_own" on public.memory_likes;
create policy "memory_likes_delete_own"
on public.memory_likes for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "memory_comments_read_authenticated" on public.memory_comments;
create policy "memory_comments_read_authenticated"
on public.memory_comments for select
to authenticated
using (true);

drop policy if exists "memory_comments_insert_own" on public.memory_comments;
create policy "memory_comments_insert_own"
on public.memory_comments for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "memory_comments_delete_own" on public.memory_comments;
create policy "memory_comments_delete_own"
on public.memory_comments for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "story_likes_read_authenticated" on public.story_likes;
create policy "story_likes_read_authenticated"
on public.story_likes for select
to authenticated
using (true);

drop policy if exists "story_likes_insert_own" on public.story_likes;
create policy "story_likes_insert_own"
on public.story_likes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "story_likes_delete_own" on public.story_likes;
create policy "story_likes_delete_own"
on public.story_likes for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "story_comments_read_authenticated" on public.story_comments;
create policy "story_comments_read_authenticated"
on public.story_comments for select
to authenticated
using (true);

drop policy if exists "story_comments_insert_own" on public.story_comments;
create policy "story_comments_insert_own"
on public.story_comments for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "story_comments_delete_own" on public.story_comments;
create policy "story_comments_delete_own"
on public.story_comments for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read"
on storage.objects for select
to public
using (bucket_id = 'images');

drop policy if exists "images_admin_insert" on storage.objects;
create policy "images_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "images_admin_update" on storage.objects;
create policy "images_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'images' and public.is_admin())
with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed sanity record for diagnostics
-- ---------------------------------------------------------------------------
insert into public.trips (
  name,
  tagline,
  description,
  region,
  terrain,
  duration,
  price,
  group_size,
  status,
  image_url
)
select
  'Offthetrail Launch Test Trip',
  'Bootstrap validation record',
  'Used to validate that the reconnected project is reachable.',
  'Himachal Pradesh',
  'mountains',
  5,
  0,
  10,
  'draft',
  null
where not exists (
  select 1 from public.trips where name = 'Offthetrail Launch Test Trip'
);
