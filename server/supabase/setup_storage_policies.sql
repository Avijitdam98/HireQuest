-- Create the resume bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads to resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON storage.objects;
DROP POLICY IF EXISTS "Allow everything" ON storage.objects;
DROP POLICY IF EXISTS "storage_objects_policy" ON storage.objects;
DROP POLICY IF EXISTS "resume_bucket_policy" ON storage.objects;
DROP POLICY IF EXISTS "resume_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "resume_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "resume_delete_policy" ON storage.objects;

-- Disable RLS temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Create a simple permissive policy for testing
CREATE POLICY "storage_objects_policy"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
