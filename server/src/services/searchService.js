const supabase = require('./supabaseService');
const aiService = require('./aiService');

class SearchService {
  async searchJobs(params) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `);

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status);
    }
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }
    if (params.company) {
      query = query.ilike('company', `%${params.company}%`);
    }
    if (params.salary_min) {
      query = query.gte('salary_min', params.salary_min);
    }
    if (params.salary_max) {
      query = query.lte('salary_max', params.salary_max);
    }
    if (params.type) {
      query = query.eq('type', params.type);
    }
    if (params.experience_level) {
      query = query.eq('experience_level', params.experience_level);
    }
    if (params.skills) {
      query = query.contains('required_skills', params.skills);
    }
    if (params.search) {
      query = query.or(`
        title.ilike.%${params.search}%,
        description.ilike.%${params.search}%,
        company.ilike.%${params.search}%
      `);
    }

    // Apply sorting
    if (params.sort_by) {
      const order = params.sort_order === 'desc' ? { ascending: false } : { ascending: true };
      query = query.order(params.sort_by, order);
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async searchProfiles(params) {
    let query = supabase
      .from('profiles')
      .select('*');

    if (params.skills) {
      query = query.contains('skills', params.skills);
    }
    if (params.experience_min) {
      query = query.gte('years_of_experience', params.experience_min);
    }
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }
    if (params.title) {
      query = query.ilike('title', `%${params.title}%`);
    }
    if (params.search) {
      query = query.or(`
        full_name.ilike.%${params.search}%,
        title.ilike.%${params.search}%,
        bio.ilike.%${params.search}%
      `);
    }

    // Apply sorting
    if (params.sort_by) {
      const order = params.sort_order === 'desc' ? { ascending: false } : { ascending: true };
      query = query.order(params.sort_by, order);
    } else {
      query = query.order('full_name', { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async searchTeams(params) {
    let query = supabase
      .from('teams')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url),
        members:team_members(
          user:profiles(id, full_name, title, skills)
        )
      `);

    if (params.skills) {
      query = query.contains('required_skills', params.skills);
    }
    if (params.size_min) {
      query = query.gte('size', params.size_min);
    }
    if (params.size_max) {
      query = query.lte('size', params.size_max);
    }
    if (params.search) {
      query = query.or(`
        name.ilike.%${params.search}%,
        description.ilike.%${params.search}%
      `);
    }

    // Apply sorting
    if (params.sort_by) {
      const order = params.sort_order === 'desc' ? { ascending: false } : { ascending: true };
      query = query.order(params.sort_by, order);
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getJobRecommendations(userId) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');

    // Get active jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');

    // Use AI to get job matches
    const matches = await aiService.getJobMatches(profile, jobs);

    // Get full job details for matched jobs
    const matchedJobs = await Promise.all(
      matches.map(async (match) => {
        const { data: job } = await supabase
          .from('jobs')
          .select(`
            *,
            employer:profiles(id, full_name, company)
          `)
          .eq('id', match.job_id)
          .single();

        return {
          ...job,
          match_score: match.score,
          match_reasons: match.reasons,
          missing_skills: match.missing_skills,
          recommendations: match.recommendations
        };
      })
    );

    return matchedJobs;
  }

  async getTeamRecommendations(userId) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');

    // Get active teams
    const { data: teams } = await supabase
      .from('teams')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url),
        members:team_members(
          user:profiles(id, full_name, title, skills)
        )
      `)
      .eq('status', 'active');

    // Use AI to get team matches
    const matches = await aiService.getTeamMatches(profile, teams);

    // Add match details to teams
    const matchedTeams = teams.map(team => {
      const match = matches.find(m => m.team_id === team.id) || {
        score: 0,
        reasons: [],
        complementary_skills: [],
        potential_roles: []
      };

      return {
        ...team,
        match_score: match.score,
        match_reasons: match.reasons,
        complementary_skills: match.complementary_skills,
        potential_roles: match.potential_roles
      };
    });

    return matchedTeams.sort((a, b) => b.match_score - a.match_score);
  }
}

module.exports = new SearchService();
