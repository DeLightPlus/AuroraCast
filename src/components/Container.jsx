import { useEffect, useState } from 'react';
import '../App.css'
import './components.css'
import Forecast from './Forecast.jsx';
import TempNother from './TemperatureNother.jsx';

const Container = ({ 
    useCurrentLocation,
    handleSearchSubmit,      
    weatherData,
    forecastData }) =>
{     
    // console.log('weather Forecast Data', forecastData);

    const [hourly, setHourly] = useState([]);
    const [daily, setDaily] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const COLD_THRESHOLD = 10; // degrees Celsius
    const HOT_THRESHOLD = 30; // degrees Celsius
    const HEAVY_RAIN_THRESHOLD = 50; // mm in the last hour for floods

    useEffect(() => 
        {  
            GetHourlyForecast(); 
            GetDailyForecast(); 

            GetForecastAlerts();

        }, [forecastData]);    

    const GetHourlyForecast= () => 
    {  
            //Hourly Forecast  
            //http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key} 
                       
            if(forecastData.length > 0)
            {        
                //console.log( forecastData[0].dt );                 
                const hourlyForecast = forecastData.filter((hourly) => hourly.dt >= forecastData[0].dt).slice(0,8); 
                //.map((f) => (  {  temp: f.main.temp, date: f.dt_text } ))
                
                setHourly(hourlyForecast);
                //console.log('hourly 1', hourlyForecast ); 
            }
    }    

    const GetDailyForecast = () =>        
    {
        //16 Days, Daily Forecast
        //http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key} 

        // if(dailyForecastData);
        //     return dailyForecastData;

        const currentDate = new Date();

        if(forecastData.length > 0)
        {
            const dailyForecast = forecastData.filter(forecast => 
                {
                    const forecastDate = new Date(forecast.dt_txt);
                    // Filter by 12:00 PM each day and dates greater than or equal to the current date
                    return forecastDate.getHours() === 12 && forecastDate >= currentDate; 
                 });
            
            setDaily(dailyForecast);
            //console.log('daily 1', dailyForecast );         
            //return dailyForecast;
        }    
    }
    
    const GetForecastAlerts = () =>
    {
        //console.log('forecastData', forecastData);
        const extremeConditions = forecastData.filter(item => 
            item.weather.some(condition => 
                ['Thunderstorm', 'Snow', 'Rain'].includes(condition.main) // Check for severe weather types
              ))

        setAlerts(extremeConditions);
    }

    // Notify the user about extreme weather conditions
    const notifyUser = (weather) => {
        if (Notification.permission === 'granted') { // Check if notifications are allowed
            const notificationMessage = `Weather: ${weather.description}, Temperature: ${weather.temp}°C.`;

            // Create a notification with the message
            new Notification(`Upcoming Weather Alert`, {
                body: notificationMessage,
            });
        }
    };

    // Utility function to format the date with the day of the week
    const formatDateWithDay = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    // Group alerts by date
    const groupAlertsByDate = (alerts) => {
        const groupedAlerts = {};

        alerts.forEach((alert) => {
            const formattedDate = formatDateWithDay(alert.dt); // Format the date with day
            const time = new Date(alert.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get the time
            const temperature = alert.main.temp; // Get the temperature
            const description = alert.weather[0].description; // Get the weather description

            // Initialize or update alerts for each date
            if (!groupedAlerts[formattedDate]) {
                groupedAlerts[formattedDate] = {
                    alerts: [],
                    minTime: time,
                    maxTime: time,
                    temperatures: [],
                    descriptions: []
                };
            }

            // Add the current alert to the grouped alerts
            groupedAlerts[formattedDate].alerts.push({ time, description, temperature });

            // Update minTime and maxTime
            if (time < groupedAlerts[formattedDate].minTime) {
                groupedAlerts[formattedDate].minTime = time;
            }
            if (time > groupedAlerts[formattedDate].maxTime) {
                groupedAlerts[formattedDate].maxTime = time;
            }

            // Collect unique temperatures and descriptions
            groupedAlerts[formattedDate].temperatures.push(temperature);
            if (!groupedAlerts[formattedDate].descriptions.includes(description)) {
                groupedAlerts[formattedDate].descriptions.push(description);
            }
        });

        return groupedAlerts; // Return the grouped alerts
    };

    // Create formatted intervals
    const formatAlertIntervals = (groupedAlerts) => {
        const intervals = [];

        Object.entries(groupedAlerts).forEach(([date, { alerts, minTime, maxTime, temperatures, descriptions }]) => {
            const uniqueDescriptions = descriptions.join(', '); // Join unique descriptions
            const averageTemperature = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1); // Calculate average temperature
            const timeRange = (minTime !== maxTime) ? `${minTime}-${maxTime}` : minTime; // Determine time range

            // Construct the formatted interval string
            const interval = `${date}, ${timeRange}, Average Temperature: ${averageTemperature}°C, Weather: ${uniqueDescriptions}`;
            intervals.push(interval);
        });

        return intervals;
    };

    // Check for alerts and notify the user if there are any
    useEffect(() => {
        if (alerts.length > 0) {
            alerts.forEach((weather) => notifyUser(weather)); // Notify for each alert found
        }
    }, [alerts]); // Run this effect when alerts change

    const groupedAlerts = groupAlertsByDate(alerts); // Group alerts by date
    const formattedIntervals = formatAlertIntervals(groupedAlerts); // Get formatted intervals

    // console.log('weather Forecast Data 61', forecastData.length);
    // console.log('hourly 62', hourly );
    // console.log('daily 63', daily );

    return weatherData.length === 0  ? ( 
        <> Loading.... </>
     ):(
        <>        

            <div className="grid-item" id='l-aside'>
            {console.log('Alerts: ', alerts)}
            {Object.keys(groupedAlerts).length > 0 && (
                <div className='weatherAlerts'>
                    <h3>Weather Alerts</h3><hr/>
                    <div className="alerts_group">
                    {
                        formattedIntervals.map((interval, index) => {
                            console.log(interval);
                            
                        // Split the interval string into components
                        const [day, date,timeRange] = interval.split(', ');
                        const [averageTempInfo, weatherDescription] = interval.split(', Average Temperature: ');
                        
                                             
                        // Destructure the components for clarity
                        const dateAndDay = `${day}, ${date} `; // e.g., "Tue, 11/02/2024"
                        console.log(dateAndDay);
                        const timeInterval = timeRange; // e.g., "23:00-23:00"
                        const averageTemperature = averageTempInfo; // e.g., "Average Temperature: 22°C"
                        const description = weatherDescription; // e.g., "light rain"

                        return (
                            <div className='weatherAlert_card' key={index}>
                                <p><strong>{dateAndDay}</strong> | <strong>{timeInterval}</strong></p>
                                {/* <p><strong>{averageTemperature}</strong></p> */}
                                <p><strong> {description}</strong></p>
                                <hr />
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}
            { hourly.length > 0 && <Forecast type='hourly' title='Next 3 HOURS FORECAST' data={ hourly }/> }
            </div> 
                
            { weatherData && 
                <TempNother 
                    useCurrentLocation={useCurrentLocation}
                    handleSearchSubmit={handleSearchSubmit}
                    weatherData={weatherData} 
                    daily={daily}
                    alerts={alerts}
                /> 

                // { daily.length > 0 && <Forecast type='daily' title='Next 4 DAYS FORECAST' data={ daily } /> }
            }
        
    
        </>
    ); 
}
    
export default Container;
