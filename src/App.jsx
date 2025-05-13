import './App.css';
import './components/components.css';

import { useEffect, useState } from 'react';
import { GlobalSearch } from 'iconsax-react';
import Header from './components/Header/Header.jsx';

import { measure_units } from './components/constants.js';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';

import MainWeatherCard from './components/Cards/MainWeatherCard/MainWeatherCard.jsx';

import Forecast from './components/Forecast/Forecast.jsx';
import WeatherCard from './components/Cards/WeatherCardMini/WeatherCardMini.jsx';

import useCurrentLocation from './hooks/useCurrentLocation';
import useWeatherAndForecast from './hooks/useWeatherAndForecast';

// Import the new Search component
import Search from './components/Search/Search.jsx';


import CloudsSun from './components/Loaders/CloudsSun.jsx';
import SkeletonLoader from './components/Loaders/SkeletonLoader.jsx';
import VerticalLineLoader from './components/Loaders/VerticalLineLoader.jsx';
import WeatherMap from './components/Cards/WeatherMap/WeatherMap.jsx';


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

  const defaultLocation = { lat: -25.746111, lon: 28.188056 }; // Default location (Pretoria, South Africa)
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
    <div className="app-container">
      {/* Header */}
      <Header 
        isDark={isDark} 
        setTheme={setTheme}
        tempUnits={tempUnits} 
        setTempUnits={setTempUnits}
        showTermsOfService={showTermsOfService}
        setShowTermsOfService={setShowTermsOfService}
      />

      <div className="app-content">
        <div className="app-sidebar"></div>

        <div className="app-main">
          <div className="main-header">
            <Search 
              onSearch={handleSearch}
              recentSearches={savedLocations.slice(0, 5)}
            />
            <div className="mini-weather-cards">
              <WeatherCard name="Polokwane" />
              <WeatherCard name="Johannesburg" />
              <WeatherCard name="Bloemfontein" />
              <WeatherCard name="Durban" />
              <WeatherCard name="Cape Town" />
            </div>
          </div>

          <div className="main-body-weather">
            {weatherData ? (
              <>
                <MainWeatherCard 
                  weatherData={weatherData} 
                  forecastData={forecastData}
                />

                <WeatherMap location={weatherData.coord || defaultLocation} />
              </>              
            ) : (
              <div className="loading-wrapper">
                <CloudsSun />
                <SkeletonLoader />
              </div>
            )}
          </div>

          <div className="main-body-forecast">
            {loading && (
              <div className="loading-wrapper">
                <VerticalLineLoader />
                <SkeletonLoader />
              </div>
            )}
            {forecastData && <Forecast forecastData={forecastData} />}
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <CookieConsent setShowTermsOfService={setShowTermsOfService} />
        {showTermsOfService && (
          <TermsOfService setShowTermsOfService={setShowTermsOfService} />
        )}
      </footer>
    </div>
  );
};

export default WeatherApp;