-- Run this query in your Supabase SQL Editor to make admin@offthetrail.com an Admin

-- 1. First, make sure you have signed up at least once on the site with:
-- Email: admin@offthetrail.com
-- Password: Welcome@2026
-- (If you haven't, go sign up with those credentials first, then run this script)

-- 2. Update the role in the 'profiles' table
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@offthetrail.com'
);

-- 3. (Optional) Update the role in the 'users' table if you are also using that for fallback
UPDATE public.users
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@offthetrail.com'
);
