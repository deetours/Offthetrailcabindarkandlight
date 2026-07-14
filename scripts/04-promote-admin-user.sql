-- Promote an existing Supabase auth user to Offthetrail admin.
-- IMPORTANT: You must create the auth user in Supabase Console FIRST!
-- 
-- Setup steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create: admin@offthetrail.com (or change email below)
-- 3. Update target_email and target_name below
-- 4. Run this script

-- First, let's see what auth users exist:
-- SELECT id, email, created_at FROM auth.users LIMIT 20;

do $$
declare
  target_email text := 'admin@offthetrail.com';
  target_name text := 'Offthetrail Admin';
  target_user_id uuid;
begin
  -- Look up the auth user
  select id
  into target_user_id
  from auth.users
  where email = target_email;

  if target_user_id is null then
    raise exception 
      'ERROR: Auth user not found for email "%". 
       SOLUTION: Create this user first in Supabase Console > Authentication > Users', 
      target_email;
  end if;

  -- Create/update profile
  insert into public.profiles (id, full_name, role, updated_at)
  values (target_user_id, target_name, 'admin', now())
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = 'admin',
    updated_at = now();

  -- Create/update user
  insert into public.users (id, email, role, onboarding_complete, created_at, updated_at)
  values (target_user_id, target_email, 'admin', true, now(), now())
  on conflict (id) do update set
    email = excluded.email,
    role = 'admin',
    onboarding_complete = true,
    updated_at = now();

  raise notice 'Admin user % promoted successfully!', target_email;
end $$;
