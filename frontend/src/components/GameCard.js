import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaUsers } from 'react-icons/fa';
import './GameCard.css';

const GameCard = ({ game, onViewDetails }) => {
  const sportIcons = {
    soccer: '⚽',
    basketball: '🏀',
    volleyball: '🏐',
    tennis: '🎾',
    baseball: '⚾',
    football: '🏈'
  };

  // Format day and time instead of using date-fns
  const formattedTime = game.time || '00:00';

  return (
    <div className="game-card">
      <div className="game-card-header">
        <span className="sport-icon">{sportIcons[game.sport] || '🏆'}</span>
        <h3>{game.title}</h3>
      </div>
      <div className="game-card-body">
        <p className="game-info"><FaUser />Host: {game.host || 'Unknown'}</p>
        <p className="game-info">
          <FaCalendarAlt />
          {game.dayOfWeek}, {formattedTime}
        </p>
        <p className="game-info">
          <FaMapMarkerAlt />
          {game.location.city}, {game.location.state}
        </p>
        <p className="game-info">
          <FaUsers />
          {game.participants.length} / {game.maxPlayers} players
        </p>
        <p className="skill-level">Skill Level: {game.skillLevel}</p>
      </div>
      <div className="game-card-footer">
        <button
          className="view-details-btn"
          onClick={() => onViewDetails(game)}
        >
          View Details
        </button>

      </div>
    </div>
  );
};

export default GameCard; 