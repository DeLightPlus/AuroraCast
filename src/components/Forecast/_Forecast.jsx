import './components.css';
import '../App.css';
import weatherIcons from "../constants.js";
import { useEffect, useState } from 'react';

const Forecast = ({ type, title, data }) => {
    console.log(type, data);

    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    
    const [hourly, setHourly] = useState([]);
    const [daily, setDaily] = useState([]);

    useEffect(() => {
        getDailyForecast();
        getHourlyForecast();
    }, [data]);

    // Fetch and update Hourly Forecast
    const getHourlyForecast = () => {
        if (data.length > 0) {
            const hourlyForecast = data
                .filter((hourly) => hourly.dt >= data[0].dt)
                .slice(0, 8); // Get next 8 hours
            setHourly(hourlyForecast);
        }
    };

    // Fetch and update Daily Forecast
    const getDailyForecast = () => {
        if (data.length > 0) {
            const dailyForecast = data.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt);
                return forecastDate.getHours() === 12 && forecastDate >= new Date();
            });
            setDaily(dailyForecast);
        }
    };

    return (
        <div className={`Forecasts ${type}`}>
            <strong className="title">{title}</strong>
            {hourly && type === 'hourly' ? (
                <div className="v-scroll">
                    {hourly.map((h) => (
                        <div key={h.dt} className="box" id="hourlyFC">
                            
                            <h6>
                                {new Date(h.dt * 1000).toLocaleString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                            </h6>                                
                            
                            
                            <div className="hfc-content">
                                <strong style={{ fontSize: '32px' }}>
                                    <span><small>max</small>&#127777;</span>
                                    {h.main.temp.toFixed()}°C
                                </strong>

                                <div className="fc_coverImg">{weatherIcons[h.weather[0].icon]}</div>

                                <div style={{ fontSize: '16px', textAlign:"justify"}}>
                                    <div> &#128167; {h.main.humidity}%</div>
                                    <div style={{ fontSize: '16px', display: 'flex' }}>
                                        &#128168;{h.wind.speed}
                                        <div style={{ fontSize: '8px' }}> mph </div>
                                        (
                                            <div style={{ fontSize: '11px', transform: `rotate(${h.wind.deg}deg)` }}>
                                                &#11165;
                                            </div>
                                        )
                                    </div>
                                </div>  
                                
                            </div>
                        </div>
                    ))}
                </div>
            ) : daily && type === 'daily' ? (
                <div className="h-scroll">
                    {daily.map((day) => (
                        <div key={day.dt} className="box">
                            <div className="cloud">
                                <div className="fc_coverImg">{weatherIcons[day.weather[0].icon]}</div>
                            </div>
                            <div style={{ fontSize: '12px' }}>
                                {new Date(day.dt_txt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) === currentDate
                                    ? (<strong>Today</strong>)
                                    : (<strong>{new Date(day.dt_txt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>)}
                            </div>
                            <strong style={{ fontSize: '16px' }}>{day.weather[0].description}</strong>
                            <h4>{day.main.temp_max.toFixed()}°C</h4>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default Forecast;
