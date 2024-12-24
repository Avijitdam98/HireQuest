-- Enable RLS on necessary tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Applications table policies
CREATE POLICY "Enable insert for authenticated users"
ON public.applications
FOR INSERT 
TO authenticated
WITH CHECK (
    auth.uid() = jobseeker_id
);

CREATE POLICY "Enable read access for job owners and applicants"
ON public.applications
FOR SELECT
TO authenticated
USING (
    auth.uid() = jobseeker_id OR 
    EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = applications.job_id 
        AND jobs.employer_id = auth.uid()
    )
);

CREATE POLICY "Enable update for job owners"
ON public.applications
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = applications.job_id 
        AND jobs.employer_id = auth.uid()
    )
);

-- Storage policies for CV uploads
CREATE POLICY "Allow authenticated users to upload CVs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to read their own CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'resumes' AND 
    (
        auth.uid()::text = (storage.foldername(name))[1] OR
        EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE 
                storage.foldername(name)[1] = a.jobseeker_id::text AND
                j.employer_id = auth.uid()
        )
    )
);
