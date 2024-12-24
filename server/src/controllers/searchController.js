const searchService = require('../services/searchService');
const aiService = require('../services/aiService');
const { formatErrorResponse } = require('../utils/helpers');

exports.searchJobs = async (req, res) => {
  try {
    const jobs = await searchService.searchJobs(req.query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.searchProfiles = async (req, res) => {
  try {
    const profiles = await searchService.searchProfiles(req.query);
    res.json(profiles);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.searchTeams = async (req, res) => {
  try {
    const teams = await searchService.searchTeams(req.query);
    res.json(teams);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getJobRecommendations = async (req, res) => {
  try {
    const recommendations = await searchService.getJobRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getTeamRecommendations = async (req, res) => {
  try {
    const recommendations = await searchService.getTeamRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getSkillSuggestions = async (req, res) => {
  try {
    const suggestions = await aiService.getSkillSuggestions(req.body.description);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getCareerAdvice = async (req, res) => {
  try {
    const advice = await aiService.getCareerAdvice(req.user);
    res.json(advice);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.generateJobDescription = async (req, res) => {
  try {
    const { title, requirements } = req.body;
    const description = await aiService.generateJobDescription(title, requirements);
    res.json(description);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    const analysis = await aiService.analyzeResume(req.body.resumeText);
    res.json(analysis);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};
