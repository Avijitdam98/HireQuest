const OpenAI = require('openai');
const supabase = require('./supabaseService');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getJobMatches(profile, jobs) {
    try {
      const prompt = this.createJobMatchPrompt(profile, jobs);
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a job matching assistant that analyzes job postings and candidate profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error getting job matches:', error);
      return [];
    }
  }

  createJobMatchPrompt(profile, jobs) {
    return `Given a candidate with the following profile:
    ${JSON.stringify(profile, null, 2)}

    And these job postings:
    ${JSON.stringify(jobs, null, 2)}

    Analyze the match between the candidate and each job based on:
    1. Skills match (required and preferred skills)
    2. Experience level match
    3. Role and responsibilities alignment
    4. Industry relevance
    5. Location compatibility

    Return a JSON array of job matches with the following structure:
    [
      {
        "job_id": "job id",
        "score": 0-100,
        "reasons": ["reason1", "reason2"],
        "missing_skills": ["skill1", "skill2"],
        "recommendations": ["recommendation1", "recommendation2"]
      }
    ]

    Sort by match score in descending order.`;
  }

  async getTeamMatches(team, candidates) {
    try {
      const prompt = this.createTeamMatchPrompt(team, candidates);
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a team matching assistant that analyzes team profiles and candidate profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error getting team matches:', error);
      return [];
    }
  }

  createTeamMatchPrompt(team, candidates) {
    return `Given a team with the following profile:
    ${JSON.stringify(team, null, 2)}

    And these candidates:
    ${JSON.stringify(candidates, null, 2)}

    Analyze the match between each candidate and the team based on:
    1. Skill complementarity with existing team
    2. Experience level match
    3. Role fit
    4. Team size and composition
    5. Project requirements

    Return a JSON array of candidate matches with the following structure:
    [
      {
        "candidate_id": "candidate id",
        "score": 0-100,
        "reasons": ["reason1", "reason2"],
        "complementary_skills": ["skill1", "skill2"],
        "potential_roles": ["role1", "role2"]
      }
    ]

    Sort by match score in descending order.`;
  }

  async getSkillSuggestions(jobDescription) {
    try {
      const prompt = `Given this job description:
      ${jobDescription}

      Extract and suggest relevant skills that would be important for this role.
      Consider both technical and soft skills.
      Return a JSON object with the following structure:
      {
        "required_skills": ["skill1", "skill2"],
        "preferred_skills": ["skill1", "skill2"],
        "soft_skills": ["skill1", "skill2"]
      }`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a skill suggestion assistant that analyzes job descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error getting skill suggestions:', error);
      return null;
    }
  }

  async getCareerAdvice(profile) {
    try {
      const prompt = `Given this professional profile:
      ${JSON.stringify(profile, null, 2)}

      Provide career development advice including:
      1. Skill development recommendations
      2. Potential career paths
      3. Industry trends
      4. Learning resources
      5. Networking suggestions

      Return a JSON object with the following structure:
      {
        "skill_recommendations": ["skill1", "skill2"],
        "career_paths": [
          {
            "path": "path name",
            "description": "description",
            "required_skills": ["skill1", "skill2"],
            "timeline": "estimated timeline"
          }
        ],
        "industry_trends": ["trend1", "trend2"],
        "learning_resources": [
          {
            "name": "resource name",
            "type": "course/book/website",
            "url": "url if applicable"
          }
        ],
        "networking_suggestions": ["suggestion1", "suggestion2"]
      }`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a career advice assistant that analyzes professional profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error getting career advice:', error);
      return null;
    }
  }

  async generateJobDescription(title, requirements) {
    try {
      const prompt = `Generate a professional job description for:
      Title: ${title}
      Requirements: ${JSON.stringify(requirements, null, 2)}

      Include:
      1. Role overview
      2. Key responsibilities
      3. Required qualifications
      4. Preferred qualifications
      5. Benefits and perks

      Return a JSON object with the following structure:
      {
        "overview": "text",
        "responsibilities": ["resp1", "resp2"],
        "required_qualifications": ["qual1", "qual2"],
        "preferred_qualifications": ["qual1", "qual2"],
        "benefits": ["benefit1", "benefit2"]
      }`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a job description generator that analyzes job titles and requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating job description:', error);
      return null;
    }
  }

  async analyzeResume(resumeText) {
    try {
      const prompt = `Analyze this resume text:
      ${resumeText}

      Extract and analyze:
      1. Skills and expertise
      2. Experience level
      3. Key achievements
      4. Education and certifications
      5. Career progression

      Return a JSON object with the following structure:
      {
        "skills": {
          "technical": ["skill1", "skill2"],
          "soft": ["skill1", "skill2"]
        },
        "experience_level": "entry/mid/senior",
        "years_of_experience": number,
        "achievements": ["achievement1", "achievement2"],
        "education": [{
          "degree": "degree name",
          "field": "field of study",
          "institution": "institution name",
          "year": "year"
        }],
        "certifications": ["cert1", "cert2"],
        "career_progression": {
          "level": "current career level",
          "trajectory": "upward/stable/varied",
          "notable_transitions": ["transition1", "transition2"]
        }
      }`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a resume analysis assistant that analyzes resume text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      return null;
    }
  }
}

module.exports = new AIService();
