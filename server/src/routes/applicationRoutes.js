const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middlewares/auth');

// Submit a job application
router.post('/', requireAuth, applicationController.submitApplication);

// Get applications for a specific job
router.get('/job/:jobId', requireAuth, applicationController.getApplicationsByJob);

// Get applications for a specific applicant
router.get('/applicant/:applicantId', requireAuth, applicationController.getApplicationsByApplicant);

// Update application status
router.patch('/:applicationId/status', requireAuth, applicationController.updateApplicationStatus);

// Get application match score
router.get('/:applicationId/match', requireAuth, applicationController.getApplicationMatchScore);

module.exports = router;
