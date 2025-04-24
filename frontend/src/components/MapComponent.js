import React from 'react';
import './MapComponent.css';

// This is a placeholder component that replaces the Google Maps integration
const MapComponent = ({ height, interactive, showInfoWindow, onLocationSelect }) => {
  return (
    <div 
      className="map-placeholder" 
      style={{ height: height || '400px' }}
    >
      <div className="map-message">
        <h3>Map View Disabled</h3>
        <p>Google Maps integration has been removed in this version.</p>
        {interactive && (
          <p>Please use the location fields to specify where your game will be held.</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent; 