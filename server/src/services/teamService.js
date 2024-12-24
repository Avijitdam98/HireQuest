const supabase = require('./supabaseService');
const NotFoundError = require('../utils/errors/NotFoundError');
const { getTeamRecommendations } = require('../utils/helpers');

class TeamService {
  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTeam(teamId) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url),
        members:profiles!members(id, full_name, avatar_url, skills)
      `)
      .eq('id', teamId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Team not found');
    return data;
  }

  async updateTeam(teamId, updates) {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Team not found');
    return data;
  }

  async deleteTeam(teamId) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
  }

  async addMember(teamId, memberId) {
    const { data: team } = await this.getTeam(teamId);
    const updatedMembers = [...team.members, memberId];

    const { data, error } = await supabase
      .from('teams')
      .update({ members: updatedMembers })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(teamId, memberId) {
    const { data: team } = await this.getTeam(teamId);
    const updatedMembers = team.members.filter(id => id !== memberId);

    const { data, error } = await supabase
      .from('teams')
      .update({ members: updatedMembers })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTeamsByMember(memberId) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url)
      `)
      .contains('members', [memberId]);

    if (error) throw error;
    return data;
  }

  async getRecommendedMembers(teamId) {
    const { data: team } = await this.getTeam(teamId);
    const { data: candidates } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', team.members);

    if (!candidates || candidates.length === 0) return [];

    const recommendations = await getTeamRecommendations(team, candidates);
    return recommendations;
  }

  async searchTeams(searchTerm) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url)
      `)
      .or(`
        name.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%
      `)
      .order('name');

    if (error) throw error;
    return data;
  }
}

module.exports = new TeamService();
