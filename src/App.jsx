import './App.css';
import './components/components.css';

import { useEffect, useState } from 'react';
import { GlobalSearch } from 'iconsax-react';
import Header from './components/Header/Header.jsx';

import { measure_units } from './components/constants.js';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';

import TempNother from './components/TemperatureNother.jsx';

import Forecast from './components/Forecast/Forecast.jsx';
import WeatherCard from './components/WeatherCardMini/WeatherCardMini.jsx';

import useCurrentLocation from './hooks/useCurrentLocation';
import useWeatherAndForecast from './hooks/useWeatherAndForecast';


import CloudsSun from './components/Loaders/CloudsSun.jsx';
import SkeletonLoader from './components/Loaders/SkeletonLoader.jsx';
import VerticalLineLoader from './components/Loaders/VerticalLineLoader.jsx';


const api = {
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
};

const WeatherApp = () => {
  const [isDark, setTheme] = useState(true);
  const [tempUnits, setTempUnits] = useState(measure_units.metric);

  const [searchQuery, setSearchQuery] = useState('');
  const [customLocation, setCustomLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [];
  });

  const { location, error:locationError } = useCurrentLocation();
  const { weatherData, forecastData, loading, error } = useWeatherAndForecast(
    customLocation?.latitude || location?.latitude,
    customLocation?.longitude || location?.longitude,
    tempUnits
  );

  const [showTermsOfService, setShowTermsOfService] = useState(false);

  const locations = ['Polokwane', 'Cape Town', 'Johannesburg']; // Add more locations as needed

  const handleSearch = () => {
    if (searchQuery) {
      fetchLocationByName(searchQuery);
    }
  };

  const fetchLocationByName = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${tempUnits}&appid=895284fb2d2c50a520ea537456963d9c`;
      const response = await fetch(url);
      const data = await response.json();

      setCustomLocation({ latitude: data.coord.lat, longitude: data.coord.lon });
      const newSavedLocations = [...savedLocations, { cityName, lat: data.coord.lat, lon: data.coord.lon }];
      setSavedLocations(newSavedLocations);
      localStorage.setItem('savedLocations', JSON.stringify(newSavedLocations));
    } catch (error) {
      console.error('Failed to fetch location by name:', error);
    }
  };
 
  if (locationError) { return <div>{locationError}</div>; }
   
  console.log("currentLocation: ", location);
  console.log("Weather: ", weatherData);
  console.log("Forecasts: ", forecastData);

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

      <div className="grid-content">
        <div className="sidebar"></div>
      
        <div className="grid-main">
          <div className="column-main-header"> 

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
                {/* <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                    <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
                </svg>              */}
                <GlobalSearch
                  size="20"
                  color="#697689"
                />
            </div> 

            <WeatherCard name="Polokwane"/>       
            <WeatherCard name="Johannesburg"/>       
            <WeatherCard name="Bloemfontein"/>       
            <WeatherCard name="Durban"/>       
            <WeatherCard name="Cape Town"/>       
          </div>

          <div className="column1-body1">
          {
            weatherData ? ( 
              <TempNother weatherData={weatherData} /> 
            ):( 
              <div style={{display:"flex", flexDirection:"row"}}>
                <CloudsSun /> 
                <SkeletonLoader />
              </div>
            )            
          }
          </div>

          <div className="column1-body2">  
            {
              loading && ( 
                <div style={{display:"flex", flexDirection:"row", gap:"32px"}}>
                  <VerticalLineLoader /> 
                  <SkeletonLoader />
                </div>
              )    
            }
            {forecastData && <Forecast forecastData={forecastData} />}
          </div>  
        </div>
      </div>
      
      <footer className="footer">
        <CookieConsent setShowTermsOfService={setShowTermsOfService}/>
          { 
            showTermsOfService && 
              <TermsOfService 
                setShowTermsOfService={setShowTermsOfService}
              /> 
          }

        </footer>
      
      

      
    </div>
  );
};

export default WeatherApp;