const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send a message
router.post('/messages', chatController.sendMessage);

// Get messages for a chat
router.get('/:chatId/messages', chatController.getMessages);

// Create a new chat
router.post('/', chatController.createChat);

// Get user's chats
router.get('/user/:userId', chatController.getChatsByUser);

// Chat with bot
router.post('/bot', chatController.chatWithBot);

module.exports = router;
