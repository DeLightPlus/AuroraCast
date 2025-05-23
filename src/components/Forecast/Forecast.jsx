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
          dayOfWeek: date.toLocaleString('en-US', { weekday: 'short' })
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
          
          {/* Horizontal summary */}
          <div className="summary-card-horizontal">
            <div className="summary-item">
              <span role="img" aria-label="thermometer">🌡️</span>
              <div>
                <strong>{Math.round(dailyForecasts[activeDayIndex].maxTemp)}°C</strong>
                <small> / {Math.round(dailyForecasts[activeDayIndex].minTemp)}°C</small>
              </div>
            </div>
            <div className="summary-item">
              <span role="img" aria-label="humidity">💧</span>
              <strong>{dailyForecasts[activeDayIndex].hourlyData[0].main.humidity}%</strong>
            </div>
            <div className="summary-item">
              <span role="img" aria-label="wind">🌬️</span>
              <strong>{dailyForecasts[activeDayIndex].hourlyData[0].wind.speed} m/s</strong>
            </div>
            <div className="summary-item">
              <span role="img" aria-label="pressure">⚖️</span>
              <strong>{dailyForecasts[activeDayIndex].hourlyData[0].main.pressure} hPa</strong>
            </div>
          </div>

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
