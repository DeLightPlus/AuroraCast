import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { measure_units } from "../components/constants.js";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useWeatherAndForecast from "../hooks/useWeatherAndForecast";

const api = {
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDark, setTheme] = useState(() => {
    const saved = localStorage.getItem('isDark');
    return saved ? JSON.parse(saved) : true;
  });
  const [tempUnits, setTempUnits] = useState(() => {
    const saved = localStorage.getItem('tempUnits');
    return saved ? saved : measure_units.metric;
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customLocation, setCustomLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedLocationsWeather, setSavedLocationsWeather] = useState({});
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [worldClocks, setWorldClocks] = useState([
    { cityName: "Johannesburg", country: "South Africa", timezone: "Africa/Johannesburg", lat: -26.2041, lon: 28.0473 },
    { cityName: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", lat: 35.6895, lon: 139.6917 },
    { cityName: "New York", country: "USA", timezone: "America/New_York", lat: 40.7128, lon: -74.0060 },
    { cityName: "London", country: "UK", timezone: "Europe/London", lat: 51.5074, lon: -0.1278 },
    { cityName: "Sydney", country: "Australia", timezone: "Australia/Sydney", lat: -33.8688, lon: 151.2093 },
    // Add more as needed
  ]);
  const [selectedWorldClock, setSelectedWorldClock] = useState(worldClocks[0]);
  const [defaultLocation, setDefaultLocation] = useState(() => {
    const saved = localStorage.getItem('defaultLocation');
    return saved ? JSON.parse(saved) : null;
  });
  console.log('Default Location:', defaultLocation);

  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('currentLocation');
    return saved ? JSON.parse(saved) : null;
  });
  console.log('Current Location:', currentLocation);
  
  const [cookieConsent, setCookieConsent] = useState(() => {
    const saved = localStorage.getItem('cookieConsent');
    return saved ? JSON.parse(saved) : false;
  });

  const [defaultLocationWeather, setDefaultLocationWeather] = useState(() => {
    const saved = localStorage.getItem('defaultWeatherData');
    return saved ? JSON.parse(saved) : null;
  });
  const [defaultLocationForecast, setDefaultLocationForecast] = useState(() => {
    const saved = localStorage.getItem('defaultForecastData');
    return saved ? JSON.parse(saved) : null;
  });

  const fetchWeatherForLocation = async (lat, lon, cityName) => {
    // console.log(`Fetching weather for ${cityName} at lat: ${lat}, lon: ${lon}`);
    try {
      const url = `${api.base}/weather?lat=${lat}&lon=${lon}&units=${tempUnits}&appid=${api.key}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('Weather data:', data);
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

  const { location, error: locationError } = useCurrentLocation();
  const { weatherData, forecastData, loading, error } = useWeatherAndForecast(
    customLocation?.latitude || location?.latitude,
    customLocation?.longitude || location?.longitude,
    tempUnits
  );

  const handleSearch = (query) => {
    if (query) {
      fetchLocationByName(query);
      setSearchQuery('');
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

      const locationExists = savedLocations.some(
        loc => loc.cityName.toLowerCase() === cityName.toLowerCase()
      );

      if (!locationExists) {
        const newSavedLocations = [
          ...savedLocations,
          { cityName, lat: data.coord.lat, lon: data.coord.lon }
        ];
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

  const handleSetDefaultLocation = async (location) => {
    // Check if this location matches currentLocation
    const isCurrent =
      currentLocation &&
      location.lat === currentLocation.latitude &&
      location.lon === currentLocation.longitude;

    const taggedLocation = { ...location, isDefault: true, isCurrent };

    setDefaultLocation(taggedLocation);
    localStorage.setItem('defaultLocation', JSON.stringify(taggedLocation));

    // Fetch and save weather and forecast for default location
    const weatherRes = await fetch(`${api.base}/weather?lat=${location.lat}&lon=${location.lon}&units=${tempUnits}&appid=${api.key}`);
    const weatherData = await weatherRes.json();  
    setDefaultLocationWeather(weatherData);
    localStorage.setItem('defaultWeatherData', JSON.stringify(weatherData));

    const forecastRes = await fetch(`${api.base}/forecast?lat=${location.lat}&lon=${location.lon}&units=${tempUnits}&appid=${api.key}`);
    const forecastData = await forecastRes.json();
    setDefaultLocationForecast(forecastData);
    localStorage.setItem('defaultForecastData', JSON.stringify(forecastData));
  
    handleSearch(location.cityName);
  };

  const handleCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationObj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isCurrent: true
          };
          setCurrentLocation(locationObj);
          localStorage.setItem('currentLocation', JSON.stringify(locationObj));
                   
          setCustomLocation(locationObj);
          setSearchQuery('Current Location');
          setIsLoadingLocation(false);

          // After setting currentLocation:
          fetchAndSaveCurrentWeather(locationObj);
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


  const fetchAndSaveCurrentWeather = async (locationObj) => {
    const weatherRes = await fetch(`${api.base}/weather?lat=${locationObj.latitude}&lon=${locationObj.longitude}&units=${tempUnits}&appid=${api.key}`);
    const weatherData = await weatherRes.json();
    // setWeatherData(weatherData);
    localStorage.setItem('currentWeatherData', JSON.stringify(weatherData));

    const forecastRes = await fetch(`${api.base}/forecast?lat=${locationObj.latitude}&lon=${locationObj.longitude}&units=${tempUnits}&appid=${api.key}`);
    const forecastData = await forecastRes.json();
    localStorage.setItem('currentForecastData', JSON.stringify(forecastData));
  };

  const handleSelectWorldClock = (clock) => {
    setSelectedWorldClock(clock);
    setCustomLocation({ latitude: clock.lat, longitude: clock.lon });
  };

  
  const handleSetTheme = (dark) => {
    setTheme(dark);
    localStorage.setItem('isDark', JSON.stringify(dark));
  };

  const handleSetTempUnits = (units) => {
    setTempUnits(units);
    localStorage.setItem('tempUnits', units);
  };

  const handleSetCookieConsent = (consent) => {
    setCookieConsent(consent);
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        setTheme: handleSetTheme,
        tempUnits,
        setTempUnits: handleSetTempUnits,
        cookieConsent,
        setCookieConsent: handleSetCookieConsent,
        isLoadingLocation,
        setIsLoadingLocation,
        searchQuery,
        setSearchQuery,
        customLocation,
        setCustomLocation,
        savedLocations,
        setSavedLocations,
        savedLocationsWeather,
        setSavedLocationsWeather,
        showTermsOfService,
        setShowTermsOfService,
        weatherData,
        forecastData,
        loading,
        error,
        location,
        locationError,
        defaultLocation,
        currentLocation,
        setCurrentLocation,
        handleSearch,
        fetchLocationByName,
        handleRemoveLocation,
        handleSelectLocation,
        handleCurrentLocation,
        worldClocks,
        selectedWorldClock,
        handleSelectWorldClock,
        handleSetDefaultLocation,
        defaultLocationWeather,
        defaultLocationForecast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);