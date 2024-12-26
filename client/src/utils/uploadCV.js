import { supabase } from '../lib/supabase';

export const uploadCV = async (file, userId) => {
  try {
    if (!file || !userId) {
      throw new Error('File and user ID are required');
    }

    // Create a unique file name
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}.${fileExt}`;

    // Upload file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('cvs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      throw urlError;
    }

    return { url: publicUrl, path: fileName };
  } catch (error) {
    console.error('Error in uploadCV:', error);
    throw error;
  }
};
