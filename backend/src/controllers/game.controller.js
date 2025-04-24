const Game = require('../models/game.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const { 
      title, 
      sport, 
      description, 
      dayOfWeek,
      time,
      duration,
      skillLevel,
      maxPlayers,
      location 
    } = req.body;

    // Validate required fields
    if (!title || !sport || !description || !location || !dayOfWeek || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate location data
    if (!location.locationDetails || !location.city || !location.state) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide complete location information' 
      });
    }

    // Get the user's name for the host field
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create new game
    const newGame = new Game({
      title,
      sport,
      description,
      location: {
        locationDetails: location.locationDetails,
        city: location.city,
        state: location.state,
        type: 'Point',
        coordinates: [0, 0] // Default coordinates if not provided
      },
      dayOfWeek,
      time,
      duration,
      skillLevel,
      maxPlayers,
      creator: req.user.id,
      host: user.name, // Store the user's name directly
      participants: [req.user.id] // Creator is automatically a participant
    });

    await newGame.save();

    res.status(201).json({
      success: true,
      data: newGame
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all games with optional filtering
exports.getGames = async (req, res) => {
  try {
    console.log("Get games request received with query:", req.query);
    
    // Build query object from request query parameters
    const query = {};
    
    // Location filters
    if (req.query['location.city']) {
      query['location.city'] = req.query['location.city'];
    }
    
    if (req.query['location.state']) {
      query['location.state'] = req.query['location.state'];
    }
    
    // Sport filter
    if (req.query.sport) {
      query.sport = req.query.sport;
    }
    
    // Day of week filter
    if (req.query.dayOfWeek) {
      query.dayOfWeek = req.query.dayOfWeek;
    }
    
    // Creator filter
    if (req.query.creator) {
      query.creator = req.query.creator;
    }
    
    console.log("Executing query:", query);
    
    const games = await Game.find(query)
      .populate('creator', 'name profilePicture email')
      .populate('participants', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${games.length} games`);
    
    res.json(games);
  } catch (error) {
    console.error("Error in getGames:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('creator', 'name profilePicture email')
      .populate('participants', 'name profilePicture');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update game
exports.updateGame = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    title, 
    description, 
    location, 
    date, 
    duration, 
    skillLevel, 
    maxPlayers,
    status
  } = req.body;

  try {
    let game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if user is the creator
    if (game.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this game' });
    }
    
    // Check if reducing maxPlayers would kick out existing participants
    if (maxPlayers && maxPlayers < game.participants.length) {
      return res.status(400).json({ 
        message: 'Cannot reduce max players below current participant count' 
      });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (date) updateData.date = date;
    if (duration) updateData.duration = duration;
    if (skillLevel) updateData.skillLevel = skillLevel;
    if (maxPlayers) updateData.maxPlayers = maxPlayers;
    if (status) updateData.status = status;
    
    game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
    .populate('creator', 'name profilePicture')
    .populate('participants', 'name profilePicture');
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete game
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if user is the creator
    if (game.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this game' });
    }
    
    // Remove game from all participants' gamesJoined arrays
    await User.updateMany(
      { _id: { $in: game.participants } },
      { $pull: { gamesJoined: game._id } }
    );
    
    // Remove game from creator's gamesCreated array
    await User.findByIdAndUpdate(
      game.creator,
      { $pull: { gamesCreated: game._id } }
    );
    
    await game.deleteOne();
    
    res.json({ message: 'Game removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join a game
exports.joinGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if game is full
    if (game.participants.length >= game.maxPlayers) {
      return res.status(400).json({ message: 'Game is already full' });
    }
    
    // Check if user is already a participant
    if (game.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this game' });
    }
    
    // Check if game is in the future
    if (new Date(game.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot join a game that has already started' });
    }
    
    // Add user to participants
    game.participants.push(req.user._id);
    await game.save();
    
    // Add game to user's gamesJoined array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { gamesJoined: game._id } }
    );
    
    const updatedGame = await Game.findById(req.params.id)
      .populate('creator', 'name profilePicture')
      .populate('participants', 'name profilePicture');
    
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Leave a game
exports.leaveGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if user is a participant
    if (!game.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not a participant in this game' });
    }
    
    // Check if user is the creator
    if (game.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'Game creator cannot leave. Delete the game instead.' 
      });
    }
    
    // Remove user from participants
    game.participants = game.participants.filter(
      participant => participant.toString() !== req.user._id.toString()
    );
    await game.save();
    
    // Remove game from user's gamesJoined array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { gamesJoined: game._id } }
    );
    
    const updatedGame = await Game.findById(req.params.id)
      .populate('creator', 'name profilePicture')
      .populate('participants', 'name profilePicture');
    
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 