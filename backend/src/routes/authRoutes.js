const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Register a new user
router.post('/register', authController.registerUser);

// Login user
router.post('/login', authController.loginUser);

// Get user profile
router.get('/me', protect, authController.getUserProfile);

module.exports = router; 