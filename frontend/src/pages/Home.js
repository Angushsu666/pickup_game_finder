import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is authenticated, show the map directly
  if (isAuthenticated) {
    return (
      <div className="map-page">
        <div className="map-header">
          <h1>Pickup Games Map</h1>
          <Link to="/games/create" className="create-game-btn">Create Game</Link>
        </div>
        <div className="map-container-wrapper">
          <MapComponent 
            height="calc(100vh - 150px)"
            interactive={true}
            showInfoWindow={true}
          />
        </div>
      </div>
    );
  }

  // If not authenticated, show simple login/register options
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Find Pickup Games Near You</h1>
        <p>Join local sports games or create your own.</p>
        
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 