const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/resend-verification', authController.resendVerification);
router.post('/verify', authController.verifyEmail);
router.get('/verification-status', authController.getVerificationStatus);
router.get('/callback', authController.handleWebCallback);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
