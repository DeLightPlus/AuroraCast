// Utility function to format the date with the day of the week
export const formatDateWithDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Group alerts by date
  export const groupAlertsByDate = (alerts) => {
    const groupedAlerts = {};
  
    alerts.forEach((alert) => {
      const formattedDate = formatDateWithDay(alert.dt);
      const time = new Date(alert.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const temperature = alert.main.temp;
      const description = alert.weather[0].description;
  
      if (!groupedAlerts[formattedDate]) {
        groupedAlerts[formattedDate] = {
          alerts: [],
          minTime: time,
          maxTime: time,
          temperatures: [],
          descriptions: []
        };
      }
  
      groupedAlerts[formattedDate].alerts.push({ time, description, temperature });
  
      if (time < groupedAlerts[formattedDate].minTime) {
        groupedAlerts[formattedDate].minTime = time;
      }
      if (time > groupedAlerts[formattedDate].maxTime) {
        groupedAlerts[formattedDate].maxTime = time;
      }
  
      groupedAlerts[formattedDate].temperatures.push(temperature);
      if (!groupedAlerts[formattedDate].descriptions.includes(description)) {
        groupedAlerts[formattedDate].descriptions.push(description);
      }
    });
  
    return groupedAlerts;
  };
  
  // Format grouped alerts into readable intervals
  export const formatAlertIntervals = (groupedAlerts) => {
    const intervals = [];
  
    Object.entries(groupedAlerts).forEach(([date, { alerts, minTime, maxTime, temperatures, descriptions }]) => {
      const uniqueDescriptions = descriptions.join(', ');
      const averageTemperature = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);
      const timeRange = minTime !== maxTime ? `${minTime}-${maxTime}` : minTime;
  
      const interval = `${date}, ${timeRange}, Average Temperature: ${averageTemperature}°C, Weather: ${uniqueDescriptions}`;
      intervals.push(interval);
    });
  
    return intervals;
  };
  