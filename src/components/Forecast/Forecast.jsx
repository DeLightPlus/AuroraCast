import './Forecast.css';
import React, { useState } from 'react';

// Function to format the date in dd/mmm/yyyy format
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
};

const Forecast = ({ forecastData }) => {
  // Manage active tab state (for daily forecast)
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
          hourlyData: [entry], // Add the current entry to the hourly data for this day
          maxTemp: entry.main.temp_max, // Store max temperature for the day
          minTemp: entry.main.temp_min, // Store min temperature for the day
          dayOfWeek: date.toLocaleString('en-US', { weekday: 'short' }) // Get the day of the week
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

  // Function to handle tab change
  const handleTabChange = (index) => {
    setActiveDayIndex(index);
  };

  return (
    <div>
      {/* Tabs for each day's forecast */}
      <div className="tabs">
        {dailyForecasts.map((day, index) => {
          const isToday = day.date === today; // Check if the day is today

          return (
            <button
              key={index}
              className={`tab-button ${activeDayIndex === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {
                isToday ? (
                  <>
                    <p>Today</p>
                    <p>{`⬆${day.maxTemp.toFixed(0)}°C`} {`⬇${day.minTemp.toFixed(0)}°C`}</p>
                  </>
                ) : (
                  <>
                    <p>{`${new Date(day.date).getDate()} ${day.dayOfWeek}`}</p>
                    <p>{`⬆${day.maxTemp.toFixed(0)}°C`} {`⬇${day.minTemp.toFixed(0)}°C`}</p>
                  </>
                )
              }
            </button>
          );
        })}
      </div>

      {/* Content for the active tab */}
      {dailyForecasts[activeDayIndex] && (
        <div className="forecast-content">
          <h2>Weather for {dailyForecasts[activeDayIndex].date}</h2>
          
          {/* Horizontal summary */}
          <div className="summary-card-horizontal">
            <div className="summary-item">
              <span role="img" aria-label="thermometer">🌡️</span>
              <strong>{Math.round(dailyForecasts[activeDayIndex].hourlyData[0].main.temp)}°C</strong>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
