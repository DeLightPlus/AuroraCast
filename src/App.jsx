import './App.css';
import './components/components.css';

import Header from './components/Header/Header.jsx';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import MainWeatherCard from './components/Cards/MainWeatherCard/MainWeatherCard.jsx';
import Forecast from './components/Forecast/Forecast.jsx';
import WeatherCardMini from './components/Cards/WeatherCardMini/WeatherCardMini.jsx';
import Search from './components/Search/Search.jsx';
import CloudsSun from './components/Loaders/CloudsSun.jsx';
import SkeletonLoader from './components/Loaders/SkeletonLoader.jsx';
import VerticalLineLoader from './components/Loaders/VerticalLineLoader.jsx';
import WeatherMap from './components/Cards/WeatherMap/WeatherMap.jsx';
import ClockHero from './components/ClockHero/ClockHero.jsx';
import SetDefaultLocationModal from './components/Modals/SetDefaultLocationModal.jsx';

import { useAppContext } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import { useEffect, useRef, useState } from 'react';
import AdPlaceholder from './components/Cards/AdPlaceholder/AdPlaceholder.jsx';

const WeatherApp = () => {
  const {
    isDark, setTheme, tempUnits, setTempUnits, isLoadingLocation,
    showTermsOfService, setShowTermsOfService,
    savedLocations, savedLocationsWeather,
    weatherData, forecastData, loading, locationError,
    handleSearch, handleRemoveLocation, handleSelectLocation, handleCurrentLocation,
    defaultLocation, handleSetDefaultLocation
  } = useAppContext();

  const heroRef = useRef();
  const [isAtHero, setIsAtHero] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtHero(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);  

  console.log(isAtHero);
  
  

  // Show modal if no default location
  if (!defaultLocation) {
    return (
      <SetDefaultLocationModal onSetDefault={handleSetDefaultLocation} />
    );
  }

  if (locationError && !defaultLocation) {
    return <div>{locationError}</div>;
  }

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
        isAtHero={isAtHero}
      />

      <div className="app-content">
        <Sidebar/>

        <div className="app-main">
          <div className="main-header">
            <Search 
              onSearch={handleSearch}
              recentSearches={savedLocations.slice(0, 5)}
            />
            {savedLocations && savedLocations.length > 0 && 
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
            }
          </div>
          
          <section ref={heroRef} className="clock-hero">
            <ClockHero isAtHero={isAtHero}/>
          </section>

          <div className="main-body-weather">
            {weatherData ? (
              <>
                <MainWeatherCard 
                  weatherData={weatherData} 
                  forecastData={forecastData}
                />
                <div className='map-N-ad'> 
                  <WeatherMap location={weatherData.coord} />
                  <AdPlaceholder />
                </div>
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