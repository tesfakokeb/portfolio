const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);

module.exports = router;
