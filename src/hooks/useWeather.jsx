import { useState, useEffect } from 'react';
import axios from 'axios';

const api = {
  key: '895284fb2d2c50a520ea537456963d9c',
  base: 'https://api.openweathermap.org/data/2.5',
};

const useWeather = (latitude, longitude, tempUnits = 'metric') => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key}`;
        const response = await axios.get(url);
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude, tempUnits]);

  return { weather, loading, error };
};

export default useWeather;
