import React, { useState } from 'react';
import './DefaultLocationModal.css';
import { useAppContext } from '../../context/AppContext.jsx';

const SetDefaultLocationModal = ({ onSetDefault }) => {
  const {
    handleSearch,
    isDark,
    setTheme,
    tempUnits,
    setTempUnits,
    cookieConsent,
    setCookieConsent,
    showTermsOfService,
    setShowTermsOfService,
  } = useAppContext();

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);

  // Fetch location suggestions from OpenWeatherMap (or other API)
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    // Example: OpenWeatherMap Geocoding API
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=895284fb2d2c50a520ea537456963d9c`
    );
    const data = await res.json();
    console.log(data, 'Location suggestions');
    setSuggestions(data);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Handle selection from suggestions
  const handleSelectSuggestion = (suggestion) => {
    
    setInput(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
    onSetDefault({
      cityName: suggestion.name,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon,
    });
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    setLoading(true);
    setGeoError(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // Reverse geocode to get city name
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=895284fb2d2c50a520ea537456963d9c`
          );
          const [data] = await res.json();
          setLoading(false);
          if (data) {
            onSetDefault({
              cityName: data.name,
              country: data.country,
              lat,
              lon,
            });
          }
        },
        () => {
          setLoading(false);
          setGeoError(true);
        }
      );
    } else {
      setLoading(false);
      setGeoError(true);
    }
  };

  // Handle submit (search for location and weather)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    // Geocode input
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=1&appid=895284fb2d2c50a520ea537456963d9c`
    );
    const [data] = await res.json();
    setLoading(false);
    if (data) {
      await onSetDefault({
        cityName: data.name,
        country: data.country,
        lat: data.lat,
        lon: data.lon,
      });
      handleSearch(data.name);
    }
  }; 

  const cleanCityName = (name) => {
    // Remove common suffixes
    return name
      .replace(/ Metropolitan Municipality$/i, '')
      .replace(/ Municipality$/i, '')
      .replace(/ District$/i, '')
      .replace(/ City$/i, '')
      .replace(/ Local Municipality$/i, '')
      .replace(/ County$/i, '')
      .trim();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Welcome! Set Up Your Preferences</h2>
        {/* Location selection */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your city..."
            autoFocus
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input}>
            Set Default Location
          </button>
        </form>
        <button
          className="modal-set-button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
        >
          Use Current Location
        </button>
        {geoError && (
          <div className="error-message">
            User denied Geolocation. You can still search and set your location manually.
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s) => (
              <li key={s.lat + s.lon} onClick={() => handleSelectSuggestion(s)}>
                {cleanCityName(s.name)}, {s.country}
              </li>
            ))}
          </ul>
        )}
        {loading && <div className="modal-loading">Loading...</div>}

        {/* Theme toggle */}
        <div className="modal-section">
          <label>
            <input
              type="checkbox"
              checked={isDark}
              onChange={e => setTheme(e.target.checked)}
            />
            Dark Mode
          </label>
        </div>

        {/* Temperature units */}
        <div className="modal-section">
          <label>
            Temperature Units:
            <select
              value={tempUnits}
              onChange={e => setTempUnits(e.target.value)}
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </label>
        </div>

        {/* Cookie consent */}
        {!cookieConsent && (
          <div className="modal-section">
            <label>
              <input
                type="checkbox"
                checked={cookieConsent}
                onChange={e => setCookieConsent(e.target.checked)}
              />
              I accept cookies
            </label>
          </div>
        )}

        {/* Terms of Service */}
        <div className="modal-section">
          <button
            type="button"
            onClick={() => setShowTermsOfService(true)}
          >
            View Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetDefaultLocationModal;