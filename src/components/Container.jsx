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
    
    // Group alerts by date and select the highest and lowest temperature alerts
    const groupAlertsByDate = (alerts) => {
        const groupedAlerts = {};

        alerts.forEach((alert) => {
        const date = new Date(alert.dt * 1000).toLocaleDateString(); // Get the date in a readable format
        const description = alert.weather[0].description; // Get the weather description
        const temp_max = alert.main.temp_max; // Get the maximum temperature
        const temp_min = alert.main.temp_min; // Get the minimum temperature

        // Initialize or update alerts for each date
        if (!groupedAlerts[date]) {
            groupedAlerts[date] = {
            highest: { time: new Date(alert.dt * 1000).toLocaleTimeString(), description, temp: temp_max, type: 'high' },
            lowest: { time: new Date(alert.dt * 1000).toLocaleTimeString(), description, temp: temp_min, type: 'low' },
            };
        } else {
            // Update highest temperature alert if needed
            if (temp_max > groupedAlerts[date].highest.temp) {
            groupedAlerts[date].highest = { time: new Date(alert.dt * 1000).toLocaleTimeString(), description, temp: temp_max, type: 'high' };
            }
            // Update lowest temperature alert if needed
            if (temp_min < groupedAlerts[date].lowest.temp) {
            groupedAlerts[date].lowest = { time: new Date(alert.dt * 1000).toLocaleTimeString(), description, temp: temp_min, type: 'low' };
            }
        }
        });

        return groupedAlerts; // Return the grouped alerts
    };

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

    // Check for alerts and notify the user if there are any
    useEffect(() => {
        if (alerts.length > 0) {
        alerts.forEach((weather) => notifyUser(weather)); // Notify for each alert found
        }
    }, [alerts]); // Run this effect when alerts change

    const groupedAlerts = groupAlertsByDate(alerts); // Group alerts by date
    
    // console.log('weather Forecast Data 61', forecastData.length);
    // console.log('hourly 62', hourly );
    // console.log('daily 63', daily );

    return weatherData.length === 0  ? ( 
        <> Loading.... </>
     ):(
        <> 
            

            <div className="grid-item" id='l-aside'>
            { console.log('Alerts: ', alerts) }
            {
                Object.keys(groupedAlerts).length > 0 && ( // Check if there are any grouped alerts
                <div>
                <h3>Weather Alerts by Day</h3>
                {
                    Object.entries(groupedAlerts).map(([date, alert]) => ( // Iterate over each date's alerts
                        <div key={date}>
                            <h4>{date}</h4> {/* Display the date */}
                            <ul>
                                <li>
                                    <strong>{alert.time}</strong>: 
                                    {alert.description}, High: {alert.temp_max}°C
                                </li>
                            </ul>
                        </div>
                        ))
                }
                </div>
            )
            }
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
