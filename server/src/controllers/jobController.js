const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const jobService = require('../services/jobService');
const { formatErrorResponse } = require('../utils/helpers');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobs(req.query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getJobMatches = async (req, res) => {
  try {
    const recommendations = await jobService.getRecommendedJobs(req.user);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.json(job);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const jobs = await jobService.searchJobs(req.query.q);
    res.json(jobs);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};
