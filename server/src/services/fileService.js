const supabase = require('./supabaseService');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileService {
  constructor() {
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    this.allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
  }

  async uploadProfileImage(userId, file) {
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${userId}-${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    // Update user's profile with new image URL
    await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId);

    return urlData.publicUrl;
  }

  async uploadResume(userId, file) {
    if (!this.allowedDocTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${userId}-${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Update user's profile with new resume URL
    await supabase
      .from('profiles')
      .update({ resume_url: urlData.publicUrl })
      .eq('id', userId);

    return urlData.publicUrl;
  }

  async uploadTeamImage(teamId, file) {
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${teamId}-${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from('team-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('team-images')
      .getPublicUrl(fileName);

    // Update team with new image URL
    await supabase
      .from('teams')
      .update({ image_url: urlData.publicUrl })
      .eq('id', teamId);

    return urlData.publicUrl;
  }

  async uploadChatFile(chatId, file) {
    if (file.size > this.maxFileSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${chatId}-${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async deleteFile(bucket, fileName) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  }
}

module.exports = new FileService();
