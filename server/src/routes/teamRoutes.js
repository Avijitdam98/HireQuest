const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Create a new team
router.post('/', teamController.createTeam);

// Get team details
router.get('/:teamId', teamController.getTeam);

// Find potential team members
router.post('/:teamId/find-members', teamController.findTeamMembers);

// Join a team
router.post('/:teamId/join', teamController.joinTeam);

// Leave a team
router.post('/:teamId/leave', teamController.leaveTeam);

module.exports = router;
