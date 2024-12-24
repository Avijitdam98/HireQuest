-- First ensure we have the correct columns and types
ALTER TABLE profiles 
  ALTER COLUMN id SET DATA TYPE uuid USING id::uuid,
  ALTER COLUMN role SET DEFAULT 'jobseeker';

-- Add foreign key constraints to jobs table
ALTER TABLE jobs
  DROP CONSTRAINT IF EXISTS jobs_employer_id_fkey,
  ADD CONSTRAINT jobs_employer_id_fkey 
    FOREIGN KEY (employer_id) 
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Add foreign key constraints to applications table
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_job_id_fkey,
  ADD CONSTRAINT applications_job_id_fkey 
    FOREIGN KEY (job_id) 
    REFERENCES jobs(id)
    ON DELETE CASCADE;

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey,
  ADD CONSTRAINT applications_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id)
    ON DELETE CASCADE;
