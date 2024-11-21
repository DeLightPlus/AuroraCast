import { useEffect, useState } from 'react';
import { groupAlertsByDate, formatAlertIntervals } from './forecastUtils';


export function useWeatherInsights(forecastData) {
  const [alerts, setAlerts] = useState([]);

  // Fetch and update Weather Alerts
  const getForecastAlerts = () => {
    const extremeConditions = forecastData.filter((item) =>
      item.weather.some((condition) =>
        ['Thunderstorm', 'Snow', 'Rain'].includes(condition.main)
      )
    );
    setAlerts(extremeConditions);
  };

  // Fetch all forecast data on component mount or when forecastData changes
  useEffect(() => {
    getHourlyForecast();
    getDailyForecast();
    getForecastAlerts();
  }, [forecastData]);

  return { hourly, daily, alerts };
}


export function WeatherInsights(forecastData) {
  // Use the custom hook to get hourly, daily, and alerts
  const { hourly, daily, alerts } = useWeatherInsights(forecastData);

  // Format and group alerts
  const groupedAlerts = groupAlertsByDate(alerts);
  const formattedIntervals = formatAlertIntervals(groupedAlerts);

  // Example: Render data programmatically (or return for external usage)
  console.log('Hourly Forecast:', hourly);
  console.log('Daily Forecast:', daily);
  console.log('Weather Alerts:', formattedIntervals);

  // Return structured data (optional)
  return {
    hourly,
    daily,
    alerts,
    groupedAlerts,
    formattedIntervals,
  };
}

export default WeatherInsights;
