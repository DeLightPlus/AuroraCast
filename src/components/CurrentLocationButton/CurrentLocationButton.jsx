import React from 'react';
import './CurrentLocationButton.css';
import { LocateFixed, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const CurrentLocationButton = ({ loading, temperature }) => {
  const { currentLocation, handleSetDefaultLocation } = useAppContext(); 

  const handleClick = () => {
    if (currentLocation) {
      handleSetDefaultLocation(currentLocation);
    }
  };

  return (
    <button
      className="current-location-button"
      onClick={handleClick}
      disabled={loading}
      title="Set default to current location"
    >
      {loading ? (
        <span className="loading-spinner"></span>
      ) : (
        <>
          {currentLocation ? (
            <>
              <LocateFixed size={14} /> {temperature}
            </>
          ) : (
            <>
              <MapPin size={14} /> {temperature}
            </>
          )}
        </>
      )}
    </button>
  );
};

export default CurrentLocationButton;