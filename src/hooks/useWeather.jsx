// useWeather
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = {
  key: '895284fb2d2c50a520ea537456963d9c',
  base: 'https://api.openweathermap.org/data/2.5',
};

const useWeather = (latitude, longitude, tempUnits = 'metric') => {
  const [weather, setWeather] = useState(() => {
    // Check if there's cached weather data in localStorage
    const savedData = localStorage.getItem(`weatherData_${latitude}_${longitude}`);
    return savedData ? JSON.parse(savedData) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try 
      {
        const url = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key}`;
        const response = await axios.get(url);
        setWeather(response.data);
        setLoading(false);

        // Cache the data in localStorage
        localStorage.setItem(`weatherData_${latitude}_${longitude}`, JSON.stringify(response.data));
      } 
      catch (error) 
      {
        setError(error);
        setLoading(false);
      }
    };

    if (latitude && longitude) { fetchWeather(); }
    
  }, [latitude, longitude, tempUnits]);

  return { weather, loading, error };
};

export default useWeather;
