const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Calculate skill match percentage between two skill arrays
exports.calculateSkillMatch = (requiredSkills, userSkills) => {
  if (!requiredSkills || !userSkills) return 0;
  
  const matchedSkills = requiredSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  return (matchedSkills.length / requiredSkills.length) * 100;
};

// Get AI-powered job recommendations
exports.getJobRecommendations = async (userProfile, jobPostings) => {
  try {
    const prompt = `
    Given a user profile and job postings, recommend the best matches.
    
    User Profile:
    ${JSON.stringify(userProfile)}
    
    Job Postings:
    ${JSON.stringify(jobPostings)}
    
    Return the job IDs in order of best match, with brief explanations.
    `;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    return null;
  }
};

// Get team member recommendations
exports.getTeamRecommendations = async (team, candidates) => {
  try {
    const prompt = `
    Given a team profile and candidate profiles, recommend the best matches.
    
    Team Profile:
    ${JSON.stringify(team)}
    
    Candidates:
    ${JSON.stringify(candidates)}
    
    Return the candidate IDs in order of best match, with brief explanations.
    `;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error getting team recommendations:', error);
    return null;
  }
};

// Create a notification
exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        message,
        data
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Format error response
exports.formatErrorResponse = (error) => {
  return {
    error: error.name || 'Error',
    message: error.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  };
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate a random string
exports.generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
