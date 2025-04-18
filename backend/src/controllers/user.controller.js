const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get user profile by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('gamesCreated', 'title sport date location')
      .populate('gamesJoined', 'title sport date location');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio, interests, skillLevel, location } = req.body;
  
  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (interests) updateData.interests = interests;
    if (skillLevel) updateData.skillLevel = skillLevel;
    if (location) updateData.location = location;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user location
exports.updateLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { longitude, latitude } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get nearby users
exports.getNearbyUsers = async (req, res) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters
  
  if (!longitude || !latitude) {
    return res.status(400).json({ message: 'Longitude and latitude are required' });
  }
  
  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      _id: { $ne: req.user._id } // Exclude current user
    }).select('name profilePicture location interests skillLevel');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 