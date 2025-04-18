import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGames } from '../services/gameService';
import GameCard from '../components/GameCard';
import { format } from 'date-fns';
import { FaPlus } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [myGames, setMyGames] = useState([]);
  const [joinedGames, setJoinedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Get games created by the user
        const createdGamesResult = await getGames({ creator: user._id });
        
        if (createdGamesResult.success) {
          setMyGames(createdGamesResult.data);
        }
        
        // Get games joined by the user (excluding ones created by the user)
        const joinedGamesResult = await getGames();
        
        if (joinedGamesResult.success) {
          const joined = joinedGamesResult.data.filter(
            game => 
              game.participants.some(p => p._id === user._id) && 
              game.creator._id !== user._id
          );
          setJoinedGames(joined);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load games');
        setLoading(false);
      }
    };

    fetchGames();
  }, [user._id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/games/create" className="create-game-btn">
          <FaPlus /> Create Game
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>My Created Games</h2>
        {myGames.length > 0 ? (
          <div className="games-grid">
            {myGames.map(game => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't created any games yet.</p>
            <Link to="/games/create" className="btn btn-primary">
              Create Your First Game
            </Link>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Games I've Joined</h2>
        {joinedGames.length > 0 ? (
          <div className="games-grid">
            {joinedGames.map(game => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't joined any games yet.</p>
            <Link to="/games" className="btn btn-primary">
              Find Games to Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 