const profileService = require('../services/profileService');
const { formatErrorResponse } = require('../utils/helpers');

exports.getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.params.userId);
    res.json(profile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(req.params.userId, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getProfileSkills = async (req, res) => {
  try {
    const skills = await profileService.getProfileSkills(req.params.userId);
    res.json(skills);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.updateProfileSkills = async (req, res) => {
  try {
    const skills = await profileService.updateProfileSkills(req.params.userId, req.body.skills);
    res.json(skills);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const profile = await profileService.updateSkills(req.params.userId, req.body.skills);
    res.json(profile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const profile = await profileService.updateExperience(req.params.userId, req.body.experience);
    res.json(profile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const profile = await profileService.updateEducation(req.params.userId, req.body.education);
    res.json(profile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(formatErrorResponse(error));
    } else {
      res.status(500).json(formatErrorResponse(error));
    }
  }
};

exports.searchProfiles = async (req, res) => {
  try {
    const profiles = await profileService.searchProfiles(req.query);
    res.json(profiles);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};

exports.getProfilesBySkills = async (req, res) => {
  try {
    const profiles = await profileService.getProfilesBySkills(req.query.skills);
    res.json(profiles);
  } catch (error) {
    res.status(500).json(formatErrorResponse(error));
  }
};
