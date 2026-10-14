const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, chatController.sendMessage);
router.get('/history', optionalAuth, chatController.getChatHistory);
router.delete('/history', optionalAuth, chatController.clearChatHistory);

module.exports = router;
