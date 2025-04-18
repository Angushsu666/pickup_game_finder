import React, { useState, useEffect } from 'react';
import { getGames } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';
import MapComponent from '../components/MapComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './FindGames.css';

const FindGames = () => {
  const { updateLocation } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    sport: '',
    skillLevel: '',
    date: null,
    maxDistance: 10000 // 10km default
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Update user's location in the backend
          updateLocation(location.lng, location.lat);
          
          // Fetch games with the user's location
          fetchGames(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fetch games without location filter
          fetchGames();
        }
      );
    } else {
      // Fetch games without location filter
      fetchGames();
    }
  }, [updateLocation]);

  const fetchGames = async (location = null) => {
    setLoading(true);
    
    const queryParams = { ...filters };
    
    if (location) {
      queryParams.longitude = location.lng;
      queryParams.latitude = location.lat;
      queryParams.maxDistance = filters.maxDistance;
    }
    
    // Format date for API
    if (queryParams.date) {
      queryParams.date = format(queryParams.date, 'yyyy-MM-dd');
    }
    
    // Remove empty filters
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key]) delete queryParams[key];
    });
    
    const result = await getGames(queryParams);
    
    if (result.success) {
      setGames(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchGames(userLocation);
  };

  const resetFilters = () => {
    setFilters({
      sport: '',
      skillLevel: '',
      date: null,
      maxDistance: 10000
    });
    
    // Fetch games with reset filters
    fetchGames(userLocation);
  };

  const getMapMarkers = () => {
    return games.map(game => ({
      id: game._id,
      lat: game.location.coordinates[1],
      lng: game.location.coordinates[0],
      title: game.title,
      content: `${game.sport} - ${format(new Date(game.date), 'MMM dd, h:mm a')}`,
      link: `/games/${game._id}`
    }));
  };

  if (loading && games.length === 0) {
    return <div className="loading">Loading games...</div>;
  }

  return (
    <div className="find-games-page">
      <div className="page-header">
        <h1>Find Games</h1>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            Map View
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Sport</label>
          <select 
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
          >
            <option value="">All Sports</option>
            <option value="soccer">Soccer</option>
            <option value="basketball">Basketball</option>
            <option value="volleyball">Volleyball</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Skill Level</label>
          <select 
            value={filters.skillLevel}
            onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date</label>
          <DatePicker
            selected={filters.date}
            onChange={(date) => handleFilterChange('date', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            isClearable
          />
        </div>

        <div className="filter-group">
          <label>Distance (km)</label>
          <select 
            value={filters.maxDistance}
            onChange={(e) => handleFilterChange('maxDistance', Number(e.target.value))}
          >
            <option value="1000">1 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="25000">25 km</option>
            <option value="50000">50 km</option>
          </select>
        </div>

        <div className="filter-buttons">
          <button className="apply-btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {viewMode === 'map' ? (
        <div className="map-view">
          <MapComponent
            height="600px"
            center={userLocation}
            markers={getMapMarkers()}
            showCurrentLocation={true}
          />
        </div>
      ) : (
        <div className="list-view">
          {games.length > 0 ? (
            <div className="games-grid">
              {games.map(game => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          ) : (
            <div className="no-games">
              <p>No games found matching your criteria.</p>
              <button className="reset-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindGames; 