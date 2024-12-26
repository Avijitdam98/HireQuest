-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employer_id UUID NOT NULL,
    jobseeker_id UUID NOT NULL,
    application_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (employer_id) REFERENCES public.profiles(id),
    FOREIGN KEY (jobseeker_id) REFERENCES public.profiles(id),
    FOREIGN KEY (application_id) REFERENCES public.applications(id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chats_employer_id ON public.chats(employer_id);
CREATE INDEX IF NOT EXISTS idx_chats_jobseeker_id ON public.chats(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_chats_application_id ON public.chats(application_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for chats table
CREATE POLICY "Users can view their own chats"
    ON public.chats
    FOR SELECT
    USING (
        auth.uid() = employer_id OR
        auth.uid() = jobseeker_id
    );

CREATE POLICY "Users can create chats they're part of"
    ON public.chats
    FOR INSERT
    WITH CHECK (
        auth.uid() = employer_id OR
        auth.uid() = jobseeker_id
    );

-- Policies for messages table
CREATE POLICY "Users can view messages in their chats"
    ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND (chats.employer_id = auth.uid() OR chats.jobseeker_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their chats"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND (chats.employer_id = auth.uid() OR chats.jobseeker_id = auth.uid())
        )
        AND auth.uid() = sender_id
    );
