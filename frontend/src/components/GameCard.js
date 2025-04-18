import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import './GameCard.css';

const GameCard = ({ game }) => {
  const sportIcons = {
    soccer: '⚽',
    basketball: '🏀',
    volleyball: '🏐'
  };

  return (
    <div className="game-card">
      <div className="game-card-header">
        <span className="sport-icon">{sportIcons[game.sport]}</span>
        <h3>{game.title}</h3>
      </div>
      <div className="game-card-body">
        <p className="game-info">
          <FaCalendarAlt />
          {format(new Date(game.date), 'MMM dd, yyyy - h:mm a')}
        </p>
        <p className="game-info">
          <FaMapMarkerAlt />
          {game.location.address}
        </p>
        <p className="game-info">
          <FaUsers />
          {game.participants.length} / {game.maxPlayers} players
        </p>
        <p className="skill-level">Skill Level: {game.skillLevel}</p>
      </div>
      <div className="game-card-footer">
        <Link to={`/games/${game._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard; 