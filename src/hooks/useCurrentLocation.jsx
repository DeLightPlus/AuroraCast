import { useState, useEffect } from 'react';

const useCurrentLocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) 
    {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } 
    else { setError("Geolocation is not supported by this browser."); }
  }, []);
  
  return { location, error };
};

export default useCurrentLocation;
