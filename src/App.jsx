import './App.css';
import './components/components.css';

import { FaSearch } from "react-icons/fa";


import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header/Header.jsx';

import { measure_units } from './components/constants.js';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';

import TempNother from './components/TemperatureNother.jsx';

import Forecast from './components/Forecast.jsx';
import WeatherCard from './components/WeatherCardMini/WeatherCardMini.jsx';

import useCurrentLocation from './hooks/useCurrentLocation.jsx';
import useWeather from './hooks/useWeather.jsx';
import useForecast from './hooks/useForecast.jsx';


const api = {
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
};

const WeatherApp = () => {
  const [isDark, setTheme] = useState(true);
  const [tempUnits, setTempUnits] = useState(measure_units.metric);

  const { location, error:locationError } = useCurrentLocation();
  const { weather: weatherData, loading: weatherLoading, error: weatherError } = useWeather(location?.latitude, location?.longitude, tempUnits);
  // const { forecast, loading: forecastLoading, error: forecastError } = location.latitude && location.longitude ? useForecast(location.latitude, location.longitude, tempUnits) : { forecast: null, loading: true, error: null };
  // const [weatherData, setWeatherData] = useState({});
  // const [forecastData, setForecastData] = useState([]);

  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {    

  
  }, []);


  const LoadForecastData = async (loc, save) => {
    console.log(loc);
    
    try 
    {
      const forecastResponse = await axios.get(`${api.base}/forecast?q=${loc}&appid=${api.key}&units=${tempUnits}`);
      const forecasts = forecastResponse.data.list;
      console.log(forecasts);;

      if (save) 
      {
        localStorage.setItem('curLocationForecasts', JSON.stringify(forecasts));
      }

      setForecastData(forecasts)

      return forecasts;

    } 
    catch (error) 
    {
      console.error("Error fetching weather forecast data:", error);
    }
  };

  const CurrentLocation = () =>
  {
    console.log('use currentLocation');
    handleSearchSubmit();
  } 

  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState("")

  const locations = ['Polokwane', 'Cape Town', 'Johannesburg']; // Add more locations as needed

  const handleSearch = (loc) =>
  {
      console.log('handleSearch', loc);
      setSearchQuery(loc);
      handleSearchSubmit(loc);
  }

  const handleSearchSubmit = async () => 
  {    
    try 
    {
      if (loc) 
      {
            
      } 
      else 
      {
          
      }
    }
    catch (err)
    {
      setError('Failed to fetch weather data');
      console.error('Error:', err);
    } finally {    setLoading(false);   }
  };

  if (locationError) { return <div>{locationError}</div>; }
  
  if (weatherLoading) { return <div>Loading...</div>; }
  
    // if (weatherError || forecastError) {
    //   return <div>Error fetching data</div>;
    // }
   
  console.log("currentLocation: ", location);
  console.log("currentWeather: ", weatherData);

  return (
    <div className="grid-container">
      {/* Header */}
      <Header 
        isDark={isDark} 
        setTheme={setTheme}
        tempUnits={tempUnits} 
        setTempUnits={setTempUnits}
        showTermsOfService={showTermsOfService}
        setShowTermsOfService={setShowTermsOfService}
      />
       
      {/* Column 1 */}
      <div className="grid-column-1">

        <div className="column1-header"> 

          <div className="search-container">
              <input className="search-input"
                type="text" placeholder='Enter Location' 
                value={ searchQuery }
                onChange={(event) => {
                  const value = event.target.value;                    
                    if (/^[A-Za-z\s]*$/.test(value)) 
                    {
                      setSearchQuery(value);
                    }
                  }}

                onKeyDown={ (event) => {
                    if (event.key === 'Enter') 
                    {
                      console.log(event.target.value);
                      handleSearch(event.target.value);                                
                    }
                } } 
              />            
              <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                  <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
              </svg>             
          </div> 

            <WeatherCard />       
        </div>

        <div className="column1-body1">
        {
          weatherData && 
            <TempNother 
              useCurrentLocation={useCurrentLocation}
              handleSearchSubmit={handleSearchSubmit}
              weatherData={weatherData}
            /> }
        </div>

        <div className="column1-body2">  
          <div className="daily">
            {/* { forecastData.length > 0 && <Forecast type='daily' title='Next 4 DAYS FORECAST' data={ forecastData } /> }                 */}
          </div>
        </div>       
      </div>

      {/* Column 2 (Aside) */}
      <aside className="grid-column-2">
        <div className="hourly">
          {/* { forecastData.length > 0 && <Forecast type='hourly' title='Next 4 HOURS FORECAST' data={ forecastData } /> }                 */}
        </div>        
      </aside>

      <CookieConsent setShowTermsOfService={setShowTermsOfService}/>
        { showTermsOfService && <TermsOfService setShowTermsOfService={setShowTermsOfService}/> }

    </div>
  );
};

export default WeatherApp;