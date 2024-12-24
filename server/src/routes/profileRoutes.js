const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Get user profile
router.get('/:userId', profileController.getProfile);

// Update user profile
router.put('/:userId', profileController.updateProfile);

// Get user skills
router.get('/:userId/skills', profileController.getProfileSkills);

// Update user skills
router.put('/:userId/skills', profileController.updateProfileSkills);

module.exports = router;
