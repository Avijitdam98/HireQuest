import { supabase } from '../lib/supabase';

export const initializeChat = async (application, currentUserId) => {
  try {
    // Check if chat already exists
    const { data: existingChat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('application_id', application.id)
      .single();

    if (chatError && chatError.code !== 'PGRST116') {
      throw chatError;
    }

    if (existingChat) {
      return existingChat;
    }

    // Get the application details with user info
    const { data: applicationData, error: applicationError } = await supabase
      .from('applications')
      .select(`
        id,
        user_id,
        job:jobs (
          id,
          employer_id
        )
      `)
      .eq('id', application.id)
      .single();

    if (applicationError) {
      throw applicationError;
    }

    // Create new chat
    const { data: newChat, error: createError } = await supabase
      .from('chats')
      .insert([
        {
          application_id: application.id,
          employer_id: applicationData.job.employer_id,
          jobseeker_id: applicationData.user_id
        }
      ])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newChat;
  } catch (error) {
    console.error('Error initializing chat:', error);
    throw error;
  }
};
