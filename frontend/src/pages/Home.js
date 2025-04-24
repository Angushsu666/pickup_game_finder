import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to find-games
  if (isAuthenticated) {
    return <Navigate to="/find-games" />;
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