import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getGames } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './GameResults.css';

const GameResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const state = queryParams.get('state') || '';
  const city = queryParams.get('city') || '';
  const sport = queryParams.get('sport') || '';
  const dayOfWeek = queryParams.get('dayOfWeek') || '';

  const joinGame = async (gameId) => {
    if (!user || !user._id) {
      alert('You must be logged in to join a game.');
      return;
    }

    try {
      const response = await axios.post(`/games/${gameId}/join`, {
        userId: user._id,
      });
      alert(response.data.message);

      // Update the local state to show that the user joined
      setGames(prevGames =>
        prevGames.map(game =>
          game._id === gameId
            ? { ...game, participants: [...game.participants, { _id: user._id }] }
            : game
        )
      );
    } catch (error) {
      console.error(error);
      alert('Failed to join the game.');
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Build filter object
        const filters = {};
        if (state) filters['location.state'] = state;
        if (city) filters['location.city'] = city;
        if (sport) filters.sport = sport;
        if (dayOfWeek) filters.dayOfWeek = dayOfWeek;

        console.log("Searching with filters:", filters);
        const result = await getGames(filters);

        if (result.success) {
          console.log("Search results:", result.data);
          setGames(result.data);
        } else {
          setError(result.message || 'Failed to load games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('An error occurred while fetching games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [state, city, sport, dayOfWeek]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="game-results-page">
      <div className="page-header">
        <h1>Game Groups {city && state ? `in ${city}, ${state}` : 'Found'}</h1>
        <Link to="/find-games" className="back-btn">Back to Search</Link>
      </div>

      {games.length > 0 ? (
        <div className="results-container">
          <div className="game-groups-list">
            {games.map(game => (
              <div key={game._id} className="game-group-card">
                <div className="game-group-header">
                  <h2>{game.title}</h2>
                  <span className="sport-badge">{game.sport}</span>
                </div>
                <div className="game-group-details">
                  <p><strong>Host:</strong> {game.host || 'Unknown'}</p>
                  <p><strong>Location:</strong> {game.location.city}, {game.location.state}</p>
                  <p><strong>Day:</strong> {game.dayOfWeek}</p>
                  <p><strong>Time:</strong> {game.time}</p>
                  <p><strong>Players:</strong> {game.participants.length}/{game.maxPlayers}</p>
                </div>
                <div className="game-group-actions">
                  <Link to={`/games/${game._id}`} className="view-details-btn">
                    View Details
                  </Link>
                  <button
                    className="join-game-btn"
                    onClick={() => joinGame(game._id)}
                    disabled={game.participants.some(p => (p._id || p) === user._id)}
                  >
                    {game.participants.some(p => (p._id || p) === user._id) ? 'Joined' : 'Join Game'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-results">
          <p>No game groups found {city && state ? `in ${city}, ${state}` : 'matching your criteria'}.</p>
          <p>Why not <Link to="/create-game">create one</Link>?</p>
        </div>
      )}
    </div>
  );
};

export default GameResults;