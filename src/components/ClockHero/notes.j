// components/ClockHero.jsx
import React from 'react';
import moment from 'moment-timezone';
import { Sunrise, Sunset, ThermometerSun } from 'lucide-react';
import './ClockHero.css';
import { useAppContext } from '../../context/AppContext.jsx';

const ClockHero = () => {
  const {
    weatherData,
    tempUnits,
    worldClocks,
    selectedWorldClock,
    handleSelectWorldClock,
    defaultLocation, // Add this to your context if not present
    setDefaultLocation, // Add this to your context if not present
    removeWorldClock, // Add this to your context if not present
    addWorldClock, // Add this to your context if not present
    customLocation,
    currentLocation,
  } = useAppContext();

  // Determine the timezone of the searched/focused location
  const searchedTimezone = weatherData?.timezone
    ? moment.tz.zone(moment.tz.guess()).name // You may want to map OpenWeatherMap's timezone offset to a tz name
    : selectedWorldClock?.timezone;

  // Check if the searched location's timezone matches any world clock
  const isInWorldClocks = worldClocks.some(clock => clock.timezone === searchedTimezone);

  // Determine if current location is default
  const isDefault = defaultLocation
    ? (weatherData?.coord?.lat === defaultLocation.lat && weatherData?.coord?.lon === defaultLocation.lon)
    : false;

  return (
    <section className="clock-hero">
      <div className="clock-hero__content">
        <p className="clock-hero__location">
          Time in <span>{weatherData?.name ?? selectedWorldClock.cityName}</span>, {selectedWorldClock.country} currently
        </p>
        <h2 className="clock-hero__time">
          {moment().tz(selectedWorldClock.timezone).format('HH:mm:ss')}
        </h2>
        <p className="clock-hero__date">
          {moment().tz(selectedWorldClock.timezone).format('dddd, MMMM D, YYYY')}
        </p>
        <div className="clock-hero__info-row">
          <span><Sunrise size={18} /> {weatherData?.sys?.sunrise ? moment.unix(weatherData.sys.sunrise).tz(selectedWorldClock.timezone).format('HH:mm') : '--:--'}</span>
          <span><Sunset size={18} /> {weatherData?.sys?.sunset ? moment.unix(weatherData.sys.sunset).tz(selectedWorldClock.timezone).format('HH:mm') : '--:--'}</span>
          <span><ThermometerSun size={18} /> {weatherData?.main?.temp !== undefined ? `${Math.round(weatherData.main.temp)}°${tempUnits === 'metric' ? 'C' : 'F'}` : '--'}</span>
          {/* Default location logic */}
          {!isDefault ? (
            <button className="clock-hero__button" onClick={() => setDefaultLocation(weatherData?.coord)}>
              Set As Default
            </button>
          ) : (
            <span className="clock-hero__default-label">Default Location</span>
          )}
          {/* World clock add/remove logic */}
          {!isInWorldClocks ? (
            <button className="clock-hero__button" onClick={() => addWorldClock({
              cityName: weatherData?.name,
              country: selectedWorldClock.country,
              timezone: searchedTimezone,
              lat: weatherData?.coord?.lat,
              lon: weatherData?.coord?.lon
            })}>
              Add To World Clocks
            </button>
          ) : (
            <button className="clock-hero__button" onClick={() => removeWorldClock(searchedTimezone)}>
              Remove From World Clocks
            </button>
          )}
        </div>
        {/* World Clocks Grid */}
        <div className="world-clock-grid">
          {worldClocks.map(clock => {
            const now = moment().tz(clock.timezone);
            return (
              <button
                key={clock.cityName}
                className={`world-clock-column${selectedWorldClock.cityName === clock.cityName ? " selected" : ""}`}
                onClick={() => handleSelectWorldClock(clock)}
                tabIndex={0}
              >
                <div className="world-clock-city">{clock.cityName}</div>
                <div className="world-clock-time">{now.format("HH:mm")}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClockHero;
