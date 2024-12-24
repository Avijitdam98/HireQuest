-- Enable RLS on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create applications" ON public.applications;
DROP POLICY IF EXISTS "Allow users to view applications" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated users full access to applications" ON public.applications;

-- Disable RLS temporarily
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Create a single permissive policy
CREATE POLICY "applications_policy"
ON public.applications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
