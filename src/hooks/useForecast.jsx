//useForecast
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = {
  key: '895284fb2d2c50a520ea537456963d9c',
  base: 'https://api.openweathermap.org/data/2.5',
};

const useForecast = (latitude, longitude, tempUnits = 'metric') => {
  const [forecast, setForecast] = useState(() => {
    // Check if there's cached forecast data in localStorage
    const savedData = localStorage.getItem(`forecastData_${latitude}_${longitude}`);
    return savedData ? JSON.parse(savedData) : null;
  });
  const [fcLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try 
      {
        const url = `${api.base}/forecast?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key}`;
        const response = await axios.get(url);
        console.log(response);
        
        setForecast(response.data);
        setLoading(false);

         // Cache the data in localStorage
         localStorage.setItem(`forecastData_${latitude}_${longitude}`, JSON.stringify(response.data));
      }
      catch (error) 
      {
        setError(error);
        setLoading(false);
      }
    };

    if (latitude && longitude) 
    {
      fetchForecast();
    }
  }, [ latitude, longitude, tempUnits ]);

  return { forecast, fcLoading, error };
};

export default useForecast;
