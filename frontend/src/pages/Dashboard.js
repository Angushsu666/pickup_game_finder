import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGames } from '../services/gameService';
import GameCard from '../components/GameCard';
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
        if (!user || !user._id) {
          setError('User information not available');
          setLoading(false);
          return;
        }

        console.log("Current user ID:", user._id);
        
        // Get all games
        const allGamesResult = await getGames();
        
        if (allGamesResult.success && Array.isArray(allGamesResult.data)) {
          console.log("All games data:", allGamesResult.data);
          
          // Filter games created by the user - check both string and ObjectId comparison
          const created = allGamesResult.data.filter(game => {
            const creatorId = game.creator?._id || game.creator;
            return creatorId && (creatorId === user._id || creatorId.toString() === user._id);
          });
          
          console.log("Created games:", created);
          setMyGames(created);
          
          // Filter games joined by the user but not created by them
          const joined = allGamesResult.data.filter(game => {
            const creatorId = game.creator?._id || game.creator;
            const isCreator = creatorId && (creatorId === user._id || creatorId.toString() === user._id);
            
            const isParticipant = game.participants && game.participants.some(p => {
              const participantId = p._id || p;
              return participantId === user._id || participantId.toString() === user._id;
            });
            
            return isParticipant && !isCreator;
          });
          
          console.log("Joined games:", joined);
          setJoinedGames(joined);
        } else {
          console.error('Invalid games data:', allGamesResult);
          setError('Failed to load games - invalid data format');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Failed to load games');
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <Link to="/create-game" className="create-game-btn">
          <FaPlus /> Create Game
        </Link>
      </div>
      
      <div className="dashboard-section">
        <h2>My Games</h2>
        {myGames.length === 0 ? (
          <p className="no-games-message">You haven't created any games yet.</p>
        ) : (
          <div className="games-grid">
            {myGames.map(game => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}
      </div>
      
      <div className="dashboard-section">
        <h2>Games I've Joined</h2>
        {joinedGames.length === 0 ? (
          <p className="no-games-message">You haven't joined any games yet.</p>
        ) : (
          <div className="games-grid">
            {joinedGames.map(game => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 