const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.createTeam = async (req, res) => {
  try {
    const { name, description, project_type, required_skills, owner_id } = req.body;

    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name,
        description,
        project_type,
        required_skills,
        owner_id,
        members: [owner_id],
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:profiles(*)
      `)
      .eq('id', teamId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { required_skills } = req.body;

    // Get all users with matching skills
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .contains('skills', required_skills);

    if (error) throw error;

    // Use OpenAI to analyze and rank potential team members
    const prompt = `Given these potential team members with their skills and experience:
      ${JSON.stringify(users)}
      
      And these required skills: ${JSON.stringify(required_skills)}
      
      Analyze and rank the top 5 most suitable candidates based on:
      1. Skill match percentage
      2. Experience relevance
      3. Past project similarity
      
      Return only the user IDs and match scores.`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
    });

    const recommendations = JSON.parse(completion.data.choices[0].text);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    // Get current team members
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('members')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;

    // Add new member
    const updatedMembers = [...team.members, userId];
    const { data, error } = await supabase
      .from('teams')
      .update({ members: updatedMembers })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    // Get current team members
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('members')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;

    // Remove member
    const updatedMembers = team.members.filter(id => id !== userId);
    const { data, error } = await supabase
      .from('teams')
      .update({ members: updatedMembers })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
