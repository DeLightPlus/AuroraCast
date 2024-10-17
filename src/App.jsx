import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Container from './components/Container';
import GetLocation from './components/index.js';
import { measure_units } from './components/constants.js';

const api = {
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
};

const WeatherApp = () => {
  const [isDark, setTheme] = useState(true);
  const [isAutoSearching, setAutoSearch] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(true);
  const [tempUnits, setTempUnits] = useState(measure_units.metric);
  const [weatherData, setWeatherData] = useState({});

  const [forecastData, setForecastData] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocalWeatherData = () => {
      const curLocationData = JSON.parse(localStorage.getItem('curLocationWeather'));
      if (curLocationData) 
      {
        setWeatherData(curLocationData);
        // console.log(curLocationData.name);        
        LoadForecastData(curLocationData.name);
      }
    };

    if (useLocalStorage) 
    {
      loadLocalWeatherData();
    }
  }, [useLocalStorage]);

  const useCurrentLocation = () =>
  {
      console.log('use currentLocation');
      handleSearchSubmit();

  } 

  const handleSearchSubmit = async (loc) => 
  {    
    try 
    {
      if (loc) 
      {
        console.log('loc:',loc);
        const weatherResponse = await axios.get(`${api.base}/weather?q=${loc}&units=${tempUnits}&appid=${api.key}`);
        
        setWeatherData(weatherResponse.data);
        LoadForecastData(loc);
      } 
      else 
      {
        console.log('location!!: ',loc);
        await GetLocation(tempUnits);
        
        // const weatherResponse = await axios.get(`${api.base}/weather?q=${location}&units=${tempUnits}&appid=${api.key}`);
        // setWeatherData(weatherResponse.data);
        // LoadForecastData(weatherResponse.data.id);
      }
              
      
      
    }
    catch (err)
    {
      setError('Failed to fetch weather data');
      console.error('Error:', err);
    } finally {    setLoading(false);   }
  };

  const LoadForecastData = async (loc) => {
    console.log(loc);
    
    try {
      const forecastResponse = await axios.get(`${api.base}/forecast?q=${loc}&appid=${api.key}&units=${tempUnits}`);
      const forecasts = forecastResponse.data.list;

      if (isAutoSearching) 
      {
        localStorage.setItem('curLocationForecasts', JSON.stringify(forecasts));
      }

      setForecastData(forecasts);

    } catch (error) {
      console.error("Error fetching weather forecast data:", error);
    }
  };

  return (
    <div className='WeatherApp' id={isDark ? "light" : "dark"}>
      <Header 
        isDark={isDark} 
        setTheme={setTheme}
        tempUnits={tempUnits} 
        setTempUnits={setTempUnits}
        weatherData={weatherData}
      />
      <div className="Main">
      <div className="location">
                    <p>{ weatherData.name }</p>

                    <div className='bm-save-btn'>
                            {weatherData.weather && <button > <div className='icn'>&#128278;</div> </button>}
                    </div>
                </div>
        <div className="container">

          {(weatherData && forecastData) && 
            <Container    
              useCurrentLocation={useCurrentLocation} 
              handleSearchSubmit={handleSearchSubmit}              
              weatherData={weatherData} 
              forecastData={forecastData}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;