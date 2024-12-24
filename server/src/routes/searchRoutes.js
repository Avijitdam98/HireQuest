const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const searchController = require('../controllers/searchController');

// Search routes
router.get('/jobs', requireAuth, searchController.searchJobs);
router.get('/profiles', requireAuth, searchController.searchProfiles);
router.get('/teams', requireAuth, searchController.searchTeams);

// Recommendation routes
router.get('/jobs/recommendations', requireAuth, searchController.getJobRecommendations);
router.get('/teams/recommendations', requireAuth, searchController.getTeamRecommendations);

// AI-powered routes
router.post('/skills/suggestions', requireAuth, searchController.getSkillSuggestions);
router.get('/career/advice', requireAuth, searchController.getCareerAdvice);
router.post('/jobs/generate-description', requireAuth, searchController.generateJobDescription);
router.post('/resume/analyze', requireAuth, searchController.analyzeResume);

module.exports = router;
