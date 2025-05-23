import './Forecast.css';
import React, { useState } from 'react';

// Function to format the date in dd/mmm/yyyy format
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
};

// Function to format the date for tab display
const formatTabDate = (date) => {
  const day = date.getDate();
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  return `${day} ${weekday}`;
};

const Forecast = ({ forecastData }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Get today's date in dd/mmm/yyyy format
  const today = formatDate(new Date());

  // Function to group forecast data by day
  const groupForecastByDay = () => {
    if (!forecastData) return [];
    const dailyForecast = [];
    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const dayString = formatDate(date);

      // If the day is not in the dailyForecast array, add it
      if (!dailyForecast.some((day) => day.date === dayString)) {
        dailyForecast.push({
          date: dayString,
          dateObj: date,
          hourlyData: [entry],
          maxTemp: entry.main.temp_max,
          minTemp: entry.main.temp_min,
          dayOfWeek: date.toLocaleString('en-US', { weekday: 'short' }),
          weather: entry.weather[0],
          humidity: entry.main.humidity,
          windSpeed: entry.wind.speed,
          pressure: entry.main.pressure
        });
      } else {
        // If the day already exists, add the entry to that day
        const day = dailyForecast.find((day) => day.date === dayString);
        day.hourlyData.push(entry);
        // Update max and min temperatures
        if (entry.main.temp_max > day.maxTemp) day.maxTemp = entry.main.temp_max;
        if (entry.main.temp_min < day.minTemp) day.minTemp = entry.main.temp_min;
      }
    });
    return dailyForecast;
  };

  // Get grouped forecast data
  const dailyForecasts = groupForecastByDay();

  const renderWeatherAlert = (day) => {
    const isToday = day.date === today;
    return (
      <div className="forecast-alert">
        <div className="alert-header">
          <span role="img" aria-label="weather">🌤️</span>
          <h3>{isToday ? 'Current Weather' : 'Weather Forecast'}</h3>
        </div>
        <div className="alert-content">
          <p className="alert-main">
            {day.weather.description.charAt(0).toUpperCase() + day.weather.description.slice(1)} with temperatures ranging from {Math.round(day.minTemp)}°C to {Math.round(day.maxTemp)}°C
          </p>
          <div className="alert-details">
            <span>High: {Math.round(day.maxTemp)}°C</span>
            <span>Low: {Math.round(day.minTemp)}°C</span>
            <span>Wind: {Math.round(day.windSpeed)} m/s</span>
            <span>Humidity: {day.humidity}%</span>
            <span>Pressure: {day.pressure} hPa</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="forecast">
      <div className="tabs">
        {dailyForecasts.map((day, index) => (
          <button
            key={day.date}
            className={`tab-button ${index === activeDayIndex ? 'active' : ''}`}
            onClick={() => setActiveDayIndex(index)}
          >
            {day.date === today ? (
              'Today'
            ) : (
              <>
                <span className="tab-date">{formatTabDate(day.dateObj)}</span>
                <span className="tab-temp">| {Math.round(day.maxTemp)}°</span>
              </>
            )}
          </button>
        ))}
      </div>

      {dailyForecasts[activeDayIndex] && (
        <div className="forecast-content">
          <h2>Weather for {dailyForecasts[activeDayIndex].date}</h2>
          
          {/* Weather Alert */}
          {renderWeatherAlert(dailyForecasts[activeDayIndex])}        
          

          {/* Hourly forecast */}
          <h3>Hourly Forecast</h3>
          <div className="hourly-scroll">
            {dailyForecasts[activeDayIndex].hourlyData.map((entry, idx) => (
              <div key={idx} className="hourly-card">
                <p>{new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{Math.round(entry.main.temp)}°C</p>
                <p>{entry.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
