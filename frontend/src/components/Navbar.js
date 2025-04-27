import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaSearch, FaPlus, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/find-games" className="navbar-item">
                <FaSearch /> Find Games
              </Link>
              <Link to="/create-game" className="navbar-item">
                <FaPlus /> Create Game
              </Link>
              <Link to="/dashboard" className="navbar-item">
                <FaTachometerAlt /> Dashboard
              </Link>
              <div className="navbar-dropdown">
                <button className="navbar-dropdown-btn">
                  <FaUser /> {user?.name}
                </button>
                <div className="navbar-dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="navbar-item register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 