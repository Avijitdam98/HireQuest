const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middlewares/auth');

// Get user notifications
router.get('/user/:userId', requireAuth, notificationController.getNotifications);

// Mark notification as read
router.patch('/:notificationId/read', requireAuth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/user/:userId/read-all', requireAuth, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', requireAuth, notificationController.deleteNotification);

// Get unread notifications count
router.get('/user/:userId/unread', requireAuth, notificationController.getUnreadCount);

module.exports = router;
