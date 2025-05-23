import React from 'react';
import './CurrentLocationButton.css';

const CurrentLocationButton = ({ onClick, loading }) => {
  return (
    <button 
      className="current-location-button"
      onClick={onClick}
      disabled={loading}
      title="Get current location"
    >
      {loading ? (
        <span className="loading-spinner"></span>
      ) : (
        <span role="img" aria-label="current location">📍</span>
      )}
      {/* <span className="button-text">Current Location</span> */}
    </button>
  );
};

export default CurrentLocationButton; 