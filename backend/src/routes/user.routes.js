const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Update user profile
router.put(
  '/profile',
  auth,
  [
    check('name', 'Name cannot be empty').optional().not().isEmpty(),
    check('interests', 'Interests must be an array').optional().isArray(),
    check('skillLevel', 'Invalid skill level').optional().isIn(['beginner', 'intermediate', 'advanced'])
  ],
  userController.updateProfile
);

// Update user location
router.put(
  '/location',
  auth,
  [
    check('longitude', 'Longitude is required').isNumeric(),
    check('latitude', 'Latitude is required').isNumeric()
  ],
  userController.updateLocation
);

// Get nearby users
router.get('/nearby/find', auth, userController.getNearbyUsers);

module.exports = router; 