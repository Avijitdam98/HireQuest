const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Get all jobs
router.get('/', jobController.getAllJobs);

// Create a new job
router.post('/', jobController.createJob);

// Get job matches based on skills and experience
router.post('/matches', jobController.getJobMatches);

module.exports = router;
