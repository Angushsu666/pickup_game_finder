import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../services/gameService';
import { format } from 'date-fns';
import './MapComponent.css';

const MapComponent = ({ height = '400px', interactive = false, showInfoWindow = false }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [userLocation, setUserLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Hardcode the API key for development
  const MAPS_API_KEY = 'AIzaSyAo4_efKHuPV09nMGVg3XVAm6SnUaCcA2E';
  
  console.log('Google Maps API Key:', MAPS_API_KEY);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API_KEY
  });

  // Get user's location and fetch games
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setCenter(location);
          
          // Fetch games if needed
          fetchGames();
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchGames();
        }
      );
    } else {
      fetchGames();
    }
  }, []);

  const fetchGames = async () => {
    try {
      const result = await getGames();
      if (result.success) {
        setGames(result.data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  const handleMapClick = (event) => {
    if (interactive) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      // Navigate to create game page with location pre-filled
      navigate('/games/create', { 
        state: { 
          location: location 
        } 
      });
    }
  };

  const handleMarkerClick = (game) => {
    if (showInfoWindow) {
      setSelectedGame(game);
    } else {
      navigate(`/games/${game._id}`);
    }
  };

  if (!isLoaded) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-container" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
            title="Your location"
          />
        )}

        {/* Game markers */}
        {games.map((game) => (
          <Marker
            key={game._id}
            position={{
              lat: game.location.coordinates[1],
              lng: game.location.coordinates[0]
            }}
            onClick={() => handleMarkerClick(game)}
          />
        ))}

        {/* Info window for selected game */}
        {selectedGame && showInfoWindow && (
          <InfoWindow
            position={{
              lat: selectedGame.location.coordinates[1],
              lng: selectedGame.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedGame(null)}
          >
            <div className="info-window">
              <h3>{selectedGame.title}</h3>
              <p><strong>Sport:</strong> {selectedGame.sport}</p>
              <p><strong>Date:</strong> {format(new Date(selectedGame.date), 'MMM d, yyyy h:mm a')}</p>
              <p><strong>Players:</strong> {selectedGame.currentPlayers}/{selectedGame.maxPlayers}</p>
              <button onClick={() => navigate(`/games/${selectedGame._id}`)}>View Details</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent; 