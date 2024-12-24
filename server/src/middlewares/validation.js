const ValidationError = require('../utils/errors/ValidationError');

exports.validateJobApplication = (req, res, next) => {
  const { jobId, applicantId, coverLetter } = req.body;

  if (!jobId) {
    throw new ValidationError('Job ID is required');
  }

  if (!applicantId) {
    throw new ValidationError('Applicant ID is required');
  }

  if (!coverLetter || coverLetter.trim().length < 50) {
    throw new ValidationError('Cover letter must be at least 50 characters long');
  }

  next();
};

exports.validateProfile = (req, res, next) => {
  const { full_name, title, skills } = req.body;

  if (!full_name || full_name.trim().length < 2) {
    throw new ValidationError('Full name must be at least 2 characters long');
  }

  if (!title) {
    throw new ValidationError('Title is required');
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    throw new ValidationError('At least one skill is required');
  }

  next();
};

exports.validateTeam = (req, res, next) => {
  const { name, description, required_skills } = req.body;

  if (!name || name.trim().length < 2) {
    throw new ValidationError('Team name must be at least 2 characters long');
  }

  if (!description || description.trim().length < 10) {
    throw new ValidationError('Description must be at least 10 characters long');
  }

  if (!Array.isArray(required_skills) || required_skills.length === 0) {
    throw new ValidationError('At least one required skill is needed');
  }

  next();
};

exports.validateJob = (req, res, next) => {
  const { title, company, description, required_skills } = req.body;

  if (!title || title.trim().length < 2) {
    throw new ValidationError('Job title must be at least 2 characters long');
  }

  if (!company) {
    throw new ValidationError('Company name is required');
  }

  if (!description || description.trim().length < 50) {
    throw new ValidationError('Job description must be at least 50 characters long');
  }

  if (!Array.isArray(required_skills) || required_skills.length === 0) {
    throw new ValidationError('At least one required skill is needed');
  }

  next();
};

exports.validateChat = (req, res, next) => {
  const { participants, type } = req.body;

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ValidationError('At least one participant is required');
  }

  if (type && !['direct', 'group', 'team'].includes(type)) {
    throw new ValidationError('Invalid chat type');
  }

  next();
};
