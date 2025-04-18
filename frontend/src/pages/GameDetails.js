import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { getGameById, joinGame, leaveGame, deleteGame } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import { toast } from 'react-toastify';
import './GameDetails.css';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      const result = await getGameById(id);
      
      if (result.success) {
        setGame(result.data);
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    };

    fetchGame();
  }, [id]);

  const handleJoinGame = async () => {
    setIsJoining(true);
    const result = await joinGame(id);
    
    if (result.success) {
      setGame(result.data);
      toast.success('You have joined the game!');
    } else {
      toast.error(result.message);
    }
    
    setIsJoining(false);
  };

  const handleLeaveGame = async () => {
    setIsLeaving(true);
    const result = await leaveGame(id);
    
    if (result.success) {
      setGame(result.data);
      toast.success('You have left the game');
    } else {
      toast.error(result.message);
    }
    
    setIsLeaving(false);
  };

  const handleDeleteGame = async () => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      setIsDeleting(true);
      const result = await deleteGame(id);
      
      if (result.success) {
        toast.success('Game deleted successfully');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const isCreator = game.creator._id === user._id;
  const isParticipant = game.participants.some(p => p._id === user._id);
  const isFull = game.participants.length >= game.maxPlayers;
  const isPastGame = new Date(game.date) < new Date();

  const sportIcons = {
    soccer: '⚽',
    basketball: '🏀',
    volleyball: '🏐'
  };

  return (
    <div className="game-details-page">
      <div className="game-details-container">
        <div className="game-header">
          <div className="game-title-section">
            <span className="sport-icon">{sportIcons[game.sport]}</span>
            <h1>{game.title}</h1>
          </div>
          
          {isCreator && (
            <div className="creator-actions">
              <Link to={`/games/${id}/edit`} className="edit-btn">
                <FaEdit /> Edit
              </Link>
              <button 
                className="delete-btn" 
                onClick={handleDeleteGame}
                disabled={isDeleting}
              >
                <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        
        <div className="game-info-grid">
          <div className="game-info-item">
            <FaCalendarAlt />
            <div>
              <h3>Date & Time</h3>
              <p>{format(new Date(game.date), 'EEEE, MMMM d, yyyy')}</p>
              <p>{format(new Date(game.date), 'h:mm a')}</p>
            </div>
          </div>
          
          <div className="game-info-item">
            <FaClock />
            <div>
              <h3>Duration</h3>
              <p>{game.duration} minutes</p>
            </div>
          </div>
          
          <div className="game-info-item">
            <FaUsers />
            <div>
              <h3>Players</h3>
              <p>{game.participants.length} / {game.maxPlayers}</p>
              <p>Skill Level: {game.skillLevel}</p>
            </div>
          </div>
          
          <div className="game-info-item">
            <FaUser />
            <div>
              <h3>Organizer</h3>
              <p>{game.creator.name}</p>
            </div>
          </div>
        </div>
        
        <div className="game-description">
          <h2>Description</h2>
          <p>{game.description}</p>
        </div>
        
        <div className="game-location">
          <h2>Location</h2>
          <p className="location-address">
            <FaMapMarkerAlt /> {game.location.address}
          </p>
          
          <MapComponent
            height="300px"
            center={{
              lat: game.location.coordinates[1],
              lng: game.location.coordinates[0]
            }}
            markers={[
              {
                id: game._id,
                lat: game.location.coordinates[1],
                lng: game.location.coordinates[0],
                title: game.title,
                content: game.location.address
              }
            ]}
            showCurrentLocation={true}
          />
        </div>
        
        <div className="game-participants">
          <h2>Participants ({game.participants.length})</h2>
          <div className="participants-list">
            {game.participants.map(participant => (
              <div key={participant._id} className="participant-item">
                {participant.profilePicture ? (
                  <img src={participant.profilePicture} alt={participant.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{participant.name}</span>
                {participant._id === game.creator._id && (
                  <span className="organizer-badge">Organizer</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="game-actions">
          {!isCreator && !isParticipant && !isPastGame && !isFull && (
            <button 
              className="join-btn" 
              onClick={handleJoinGame}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          )}
          
          {!isCreator && isParticipant && !isPastGame && (
            <button 
              className="leave-btn" 
              onClick={handleLeaveGame}
              disabled={isLeaving}
            >
              {isLeaving ? 'Leaving...' : 'Leave Game'}
            </button>
          )}
          
          {isPastGame && (
            <div className="past-game-notice">
              This game has already taken place
            </div>
          )}
          
          {isFull && !isParticipant && !isPastGame && (
            <div className="full-game-notice">
              This game is full
            </div>
          )}
          
          <Link to="/games" className="back-btn">
            Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameDetails; 