import './App.css';
import './components/components.css';

import { useEffect, useState, useCallback } from 'react';
import { GlobalSearch } from 'iconsax-react';
import Header from './components/Header/Header.jsx';

import { measure_units } from './components/constants.js';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';

import MainWeatherCard from './components/Cards/MainWeatherCard/MainWeatherCard.jsx';

import Forecast from './components/Forecast/Forecast.jsx';
import WeatherCardMini from './components/Cards/WeatherCardMini/WeatherCardMini.jsx';

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [customLocation, setCustomLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedLocationsWeather, setSavedLocationsWeather] = useState({});

  const fetchWeatherForLocation = async (lat, lon, cityName) => {
    try {
      const url = `${api.base}/weather?lat=${lat}&lon=${lon}&units=${tempUnits}&appid=${api.key}`;
      const response = await fetch(url);
      const data = await response.json();
      setSavedLocationsWeather(prev => ({
        ...prev,
        [cityName]: data
      }));
    } catch (error) {
      console.error('Failed to fetch weather for location:', error);
    }
  };

  useEffect(() => {
    savedLocations.forEach(location => {
      fetchWeatherForLocation(location.lat, location.lon, location.cityName);
    });
  }, [savedLocations, tempUnits]);

  const { location, error:locationError } = useCurrentLocation();
  const { weatherData, forecastData, loading, error } = useWeatherAndForecast(
    customLocation?.latitude || location?.latitude,
    customLocation?.longitude || location?.longitude,
    tempUnits
  );

  const [showTermsOfService, setShowTermsOfService] = useState(false);

  const defaultLocation = { lat: -25.746111, lon: 28.188056 }; // Default location (Pretoria, South Africa)
  const locations = ['Polokwane', 'Cape Town', 'Johannesburg']; // Add more locations as needed

  const handleSearch = (query) => {
    if (query) {
      fetchLocationByName(query);
      setSearchQuery(''); // Clear the search query after searching
    }
  };

  const fetchLocationByName = async (cityName) => {
    try {
      const url = `${api.base}/weather?q=${cityName}&units=${tempUnits}&appid=${api.key}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === '404') {
        console.error('City not found');
        return;
      }

      setCustomLocation({ latitude: data.coord.lat, longitude: data.coord.lon });
      
      // Check if location already exists in savedLocations
      const locationExists = savedLocations.some(loc => loc.cityName.toLowerCase() === cityName.toLowerCase());
      
      if (!locationExists) {
        const newSavedLocations = [...savedLocations, { cityName, lat: data.coord.lat, lon: data.coord.lon }];
        setSavedLocations(newSavedLocations);
        localStorage.setItem('savedLocations', JSON.stringify(newSavedLocations));
      }
    } catch (error) {
      console.error('Failed to fetch location by name:', error);
    }
  };

  const handleRemoveLocation = (cityName) => {
    const newSavedLocations = savedLocations.filter(loc => loc.cityName !== cityName);
    setSavedLocations(newSavedLocations);
    localStorage.setItem('savedLocations', JSON.stringify(newSavedLocations));
    
    // Remove from weather data
    setSavedLocationsWeather(prev => {
      const newWeather = { ...prev };
      delete newWeather[cityName];
      return newWeather;
    });
  };

  const handleSelectLocation = (cityName) => {
    const location = savedLocations.find(loc => loc.cityName === cityName);
    if (location) {
      setCustomLocation({ latitude: location.lat, longitude: location.lon });
    }
  };

  const handleCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // Update search query to show we're using current location
          setSearchQuery('Current Location');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
    }
  }, []);

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
        onCurrentLocation={handleCurrentLocation}
        isLoadingLocation={isLoadingLocation}
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
              {savedLocations.map((location, index) => (
                <WeatherCardMini 
                  key={index}
                  name={location.cityName}
                  weather={savedLocationsWeather[location.cityName]}
                  onRemove={handleRemoveLocation}
                  onSelect={handleSelectLocation}
                />
              ))}
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