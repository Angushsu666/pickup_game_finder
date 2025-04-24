const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    sport: {
      type: String,
      required: true,
      enum: ['soccer', 'basketball', 'volleyball', 'tennis', 'baseball', 'football']
    },
    description: {
      type: String,
      required: true
    },
    location: {
      locationDetails: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    time: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // Duration in minutes
      required: true
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all'
    },
    maxPlayers: {
      type: Number,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    host: {
      type: String,
      required: true
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  {
    timestamps: true
  }
);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;