-- Completely disable RLS on storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop all storage policies
DROP POLICY IF EXISTS "Allow authenticated uploads to resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON storage.objects;
DROP POLICY IF EXISTS "Allow everything" ON storage.objects;
DROP POLICY IF EXISTS "storage_objects_policy" ON storage.objects;
DROP POLICY IF EXISTS "resume_bucket_policy" ON storage.objects;

-- Completely disable RLS on applications
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Drop all application policies
DROP POLICY IF EXISTS "Allow authenticated users to create applications" ON public.applications;
DROP POLICY IF EXISTS "Allow users to view applications" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated users full access to applications" ON public.applications;
DROP POLICY IF EXISTS "applications_policy" ON public.applications;
