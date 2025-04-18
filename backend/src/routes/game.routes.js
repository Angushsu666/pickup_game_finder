const express = require('express');
const { check } = require('express-validator');
const gameController = require('../controllers/game.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new game
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('sport', 'Valid sport is required').isIn(['soccer', 'basketball', 'volleyball']),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('location.coordinates', 'Coordinates must be an array of [longitude, latitude]').isArray({ min: 2, max: 2 }),
    check('location.address', 'Address is required').not().isEmpty(),
    check('date', 'Valid date is required').isISO8601(),
    check('duration', 'Duration in minutes is required').isNumeric(),
    check('maxPlayers', 'Maximum number of players is required').isNumeric()
  ],
  gameController.createGame
);

// Get all games with filtering
router.get('/', auth, gameController.getGames);

// Get game by ID
router.get('/:id', auth, gameController.getGameById);

// Update game
router.put(
  '/:id',
  auth,
  [
    check('title', 'Title cannot be empty').optional().not().isEmpty(),
    check('description', 'Description cannot be empty').optional().not().isEmpty(),
    check('location', 'Location must be an object').optional().isObject(),
    check('date', 'Valid date is required').optional().isISO8601(),
    check('duration', 'Duration must be numeric').optional().isNumeric(),
    check('maxPlayers', 'Max players must be numeric').optional().isNumeric(),
    check('status', 'Invalid status').optional().isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
  ],
  gameController.updateGame
);

// Delete game
router.delete('/:id', auth, gameController.deleteGame);

// Join a game
router.post('/:id/join', auth, gameController.joinGame);

// Leave a game
router.post('/:id/leave', auth, gameController.leaveGame);

module.exports = router; 