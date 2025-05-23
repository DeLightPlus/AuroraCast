import React from "react";
import "./WeatherAlerts.css";

const WeatherAlerts = ({ currentWeather, forecastData }) => {
  if (!currentWeather || !forecastData) {
    return null;
  }

  // Get current weather details
  const currentTemp = Math.round(currentWeather.main.temp);
  const currentMax = Math.round(currentWeather.main.temp_max);
  const currentMin = Math.round(currentWeather.main.temp_min);
  const currentDesc = currentWeather.weather[0].description;
  const currentWind = Math.round(currentWeather.wind.speed);
  const currentHumidity = currentWeather.main.humidity;

  // Get tomorrow's forecast
  const tomorrowForecast = forecastData.list.find(entry => {
    const date = new Date(entry.dt * 1000);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate();
  });

  const tomorrowTemp = tomorrowForecast ? Math.round(tomorrowForecast.main.temp) : null;
  const tomorrowMax = tomorrowForecast ? Math.round(tomorrowForecast.main.temp_max) : null;
  const tomorrowMin = tomorrowForecast ? Math.round(tomorrowForecast.main.temp_min) : null;
  const tomorrowDesc = tomorrowForecast ? tomorrowForecast.weather[0].description : null;

  // Generate current weather alert
  const currentAlert = (
    <div className="alert current-alert">
      <div className="alert-header">
        <span role="img" aria-label="current weather">🌤️</span>
        <h3>Current Weather</h3>
      </div>
      <div className="alert-content">
        <p className="alert-main">
          {currentDesc.charAt(0).toUpperCase() + currentDesc.slice(1)} with a temperature of {currentTemp}°C
        </p>
        <div className="alert-details">
          
        </div>
      </div>
    </div>
  );

  // Generate tomorrow's weather alert
  const tomorrowAlert = tomorrowForecast ? (
    <div className="alert tomorrow-alert">
      <div className="alert-header">
        <span role="img" aria-label="tomorrow's weather">📅</span>
        <h3>Tomorrow's Forecast</h3>
      </div>
      <div className="alert-content">
        <p className="alert-main">
          {tomorrowDesc.charAt(0).toUpperCase() + tomorrowDesc.slice(1)} with temperatures ranging from {tomorrowMin}°C to {tomorrowMax}°C
        </p>        
      </div>
    </div>
  ) : null;

  return (
    <div className="weather-alerts">
      {currentAlert}
      {tomorrowAlert}
    </div>
  );
};

export default WeatherAlerts;