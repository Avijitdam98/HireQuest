-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    jobseeker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(application_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Users can view their chats"
    ON chats FOR SELECT
    USING (
        employer_id = auth.uid() OR 
        jobseeker_id = auth.uid()
    );

CREATE POLICY "System can create chats"
    ON chats FOR INSERT
    WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages from their chats"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chats
            WHERE chats.id = chat_id
            AND (chats.employer_id = auth.uid() OR chats.jobseeker_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages to their chats"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND
        EXISTS (
            SELECT 1 FROM chats
            WHERE chats.id = chat_id
            AND (chats.employer_id = auth.uid() OR chats.jobseeker_id = auth.uid())
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chats_application_id ON chats(application_id);
CREATE INDEX IF NOT EXISTS idx_chats_employer_id ON chats(employer_id);
CREATE INDEX IF NOT EXISTS idx_chats_jobseeker_id ON chats(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Function to create a chat when an application is created
CREATE OR REPLACE FUNCTION create_application_chat()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO chats (application_id, employer_id, jobseeker_id)
    SELECT 
        NEW.id,
        jobs.employer_id,
        NEW.user_id
    FROM jobs
    WHERE jobs.id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create chat on application
CREATE TRIGGER create_chat_on_application
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION create_application_chat();

-- Function to update chat timestamp
CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chat timestamp
CREATE TRIGGER update_chat_timestamp
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_timestamp();
