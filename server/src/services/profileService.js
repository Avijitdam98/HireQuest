const supabase = require('./supabaseService');
const NotFoundError = require('../utils/errors/NotFoundError');

class ProfileService {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        experience,
        education
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data;
  }

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data;
  }

  async getProfileSkills(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data.skills;
  }

  async updateProfileSkills(userId, skills) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ skills })
      .eq('id', userId)
      .select('skills')
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data.skills;
  }

  async updateSkills(userId, skills) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ skills })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data;
  }

  async updateExperience(userId, experience) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ experience })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data;
  }

  async updateEducation(userId, education) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ education })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Profile not found');
    return data;
  }

  async searchProfiles(query) {
    const { search, skills, experience, location } = query;
    let queryBuilder = supabase
      .from('profiles')
      .select('*');

    if (search) {
      queryBuilder = queryBuilder.or(`
        full_name.ilike.%${search}%,
        title.ilike.%${search}%,
        bio.ilike.%${search}%
      `);
    }

    if (skills) {
      queryBuilder = queryBuilder.contains('skills', skills);
    }

    if (experience) {
      queryBuilder = queryBuilder.gte('years_of_experience', experience);
    }

    if (location) {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    const { data, error } = await queryBuilder.order('full_name');

    if (error) throw error;
    return data;
  }

  async getProfilesBySkills(skills) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .contains('skills', skills);

    if (error) throw error;
    return data;
  }
}

module.exports = new ProfileService();
