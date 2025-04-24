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
    check('sport', 'Valid sport is required').isIn(['soccer', 'basketball', 'volleyball', 'tennis', 'baseball', 'football']),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('location.locationDetails', 'Location details are required').not().isEmpty(),
    check('location.city', 'City is required').not().isEmpty(),
    check('location.state', 'State is required').not().isEmpty(),
    check('dayOfWeek', 'Day of week is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty(),
    check('duration', 'Duration in minutes is required').isNumeric(),
    check('maxPlayers', 'Maximum number of players is required').isNumeric()
  ],
  gameController.createGame
);

// Get all games
router.get('/', gameController.getGames);

// Get game by ID
router.get('/:id', gameController.getGameById);

// Update game
router.put('/:id', auth, gameController.updateGame);

// Delete game
router.delete('/:id', auth, gameController.deleteGame);

// Join a game
router.post('/:id/join', auth, gameController.joinGame);

// Leave a game
router.post('/:id/leave', auth, gameController.leaveGame);

module.exports = router; 