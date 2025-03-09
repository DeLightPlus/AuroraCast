import { useState, useEffect } from 'react';
import axios from 'axios';

const api = {
  key: '895284fb2d2c50a520ea537456963d9c',
  base: 'https://api.openweathermap.org/data/2.5',
};

const useWeatherAndForecast = (latitude, longitude, tempUnits = 'metric') => {
  const [weatherData, setWeatherData] = useState(() => {
    const savedData = localStorage.getItem(`weatherData_${latitude}_${longitude}`);
    return savedData ? JSON.parse(savedData) : null;
  });
  const [forecastData, setForecastData] = useState(() => {
    const savedData = localStorage.getItem(`forecastData_${latitude}_${longitude}`);
    return savedData ? JSON.parse(savedData) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      try {
        // Fetch current weather
        const weatherUrl = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key}`;
        const weatherResponse = await axios.get(weatherUrl);
        setWeatherData(weatherResponse.data);
        
        // Fetch forecast data
        const forecastUrl = `${api.base}/forecast?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key}`;
        const forecastResponse = await axios.get(forecastUrl);
        setForecastData(forecastResponse.data);

        // Save data to localStorage
        localStorage.setItem(`weatherData_${latitude}_${longitude}`, JSON.stringify(weatherResponse.data));
        localStorage.setItem(`forecastData_${latitude}_${longitude}`, JSON.stringify(forecastResponse.data));

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeatherAndForecast();
    }
  }, [latitude, longitude, tempUnits]);

  return { weatherData, forecastData, loading, error };
};

export default useWeatherAndForecast;
