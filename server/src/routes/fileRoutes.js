const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const fileController = require('../controllers/fileController');

// Profile image upload
router.post(
  '/profile/image',
  requireAuth,
  fileController.uploadMiddleware,
  fileController.uploadProfileImage
);

// Resume upload
router.post(
  '/profile/resume',
  requireAuth,
  fileController.uploadMiddleware,
  fileController.uploadResume
);

// Team image upload
router.post(
  '/teams/:teamId/image',
  requireAuth,
  fileController.uploadMiddleware,
  fileController.uploadTeamImage
);

// Chat file upload
router.post(
  '/chats/:chatId/file',
  requireAuth,
  fileController.uploadMiddleware,
  fileController.uploadChatFile
);

module.exports = router;
