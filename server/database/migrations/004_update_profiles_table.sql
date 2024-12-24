-- Add employer-specific fields to profiles table
ALTER TABLE profiles
ADD COLUMN company_name text,
ADD COLUMN company_website text,
ADD COLUMN company_size text,
ADD COLUMN industry text,
ADD COLUMN location text;

-- Update RLS policies to include new fields
ALTER POLICY "Users can view their own profile" ON profiles 
    USING (auth.uid() = user_id);

ALTER POLICY "Users can update their own profile" ON profiles 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
