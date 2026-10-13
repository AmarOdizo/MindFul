const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { optionalAuth } = require('../middleware/auth');

router.post('/log', optionalAuth, moodController.logMood);
router.get('/history', optionalAuth, moodController.getMoodHistory);
router.get('/stats', optionalAuth, moodController.getMoodStats);

module.exports = router;
