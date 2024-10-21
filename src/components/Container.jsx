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

    useEffect(() => {  GetHourlyForecast(); GetDailyForecast(); }, [forecastData]);    

    function GetHourlyForecast()
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

    function GetDailyForecast()
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

    // console.log('weather Forecast Data 61', forecastData.length);
    // console.log('hourly 62', hourly );
    // console.log('daily 63', daily );

    return weatherData.length === 0  ? ( <>
     Loading.... 
     
     </>):(
        <>   
            <div className="grid-item" id='l-aside'>
                { hourly.length > 0 && <Forecast type='hourly' title='Next 3 HOURS FORECAST' data={ hourly }/> }
            </div> 
                
            { weatherData && 
                <TempNother 
                    useCurrentLocation={useCurrentLocation}
                    handleSearchSubmit={handleSearchSubmit}
                    weatherData={weatherData} 
                    daily={daily}
                /> 

                // { daily.length > 0 && <Forecast type='daily' title='Next 4 DAYS FORECAST' data={ daily } /> }
            }
        
    
        </>
    ); 
}
    
export default Container;
