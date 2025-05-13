import React from "react";

const WeatherAlerts = ({ currentWeather, forecastData }) => {
  // Generate current weather alert
  const currentAlert = currentWeather
    ? `There will be ${currentWeather.weather[0].description}. The high will be ${Math.round(
        currentWeather.main.temp_max
      )}° and the low will be ${Math.round(currentWeather.main.temp_min)}°.`
    : "Loading current weather...";

  // Generate tomorrow's weather alert
  const tomorrowForecast = forecastData && forecastData.length > 1 ? forecastData[1] : null;
  const tomorrowAlert = tomorrowForecast
    ? `Tomorrow, expect ${tomorrowForecast.weather[0].description} with a high of ${Math.round(
        tomorrowForecast.temp.max
      )}° and a low of ${Math.round(tomorrowForecast.temp.min)}°.`
    : "Loading tomorrow's forecast...";

  return (
    <div className="weather-alerts">
      <div className="alert current-alert">
        <strong>Current Weather:</strong> {currentAlert}
      </div>
      <div className="alert tomorrow-alert">
        <strong>Tomorrow's Forecast:</strong> {tomorrowAlert}
      </div>
    </div>
  );
};

export default WeatherAlerts;