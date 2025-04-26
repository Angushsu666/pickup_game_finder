const express = require('express');
const { check } = require('express-validator');
const Game = require('../models/game.model');
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
//router.post('/:id/join', auth, gameController.joinGame);
router.post('/:id/join', async (req, res) => {
  const gameId = req.params.id;
  const userId = req.body.userId;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Optional: Check if user already joined
    if (game.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already joined' });
    }

    game.participants.push(userId);
    await game.save();

    res.status(200).json({ message: 'Successfully joined the game!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a game
//router.post('/:id/leave', auth, gameController.leaveGame);
// Leave a game
router.post('/:id/leave', async (req, res) => {
  const gameId = req.params.id;
  const userId = req.body.userId;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Remove user from participants
    game.participants = game.participants.filter(
      participant => participant.toString() !== userId
    );

    await game.save();

    res.status(200).json({ message: 'Successfully left the game!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 