const fileService = require('../services/fileService');
const { formatErrorResponse } = require('../utils/helpers');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single('file');

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await fileService.uploadProfileImage(req.user.id, req.file);
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(400).json(formatErrorResponse(error));
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumeUrl = await fileService.uploadResume(req.user.id, req.file);
    res.json({ url: resumeUrl });
  } catch (error) {
    res.status(400).json(formatErrorResponse(error));
  }
};

exports.uploadTeamImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await fileService.uploadTeamImage(req.params.teamId, req.file);
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(400).json(formatErrorResponse(error));
  }
};

exports.uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = await fileService.uploadChatFile(req.params.chatId, req.file);
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(400).json(formatErrorResponse(error));
  }
};
