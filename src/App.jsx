import './App.css';


import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Container from './components/Container';
import TempNother from './components/TemperatureNother.jsx';
import GetLocation from './components/index.js';
import { measure_units } from './components/constants.js';

const api = 
{
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
}



const WeatherApp = () => 
{
  const [isDark, setTheme] = useState(true);

  const [tempUnits, setTempUnits] = useState(measure_units.metric); //include standard || imperial || metric
  const [isAutoSearching, setAutoSearch] = useState(true);

  const [weatherData, setWeatherData] = useState({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastData, setForecastData] = useState([]); 
  
  const [curLocation, setCurLocation] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
 
  useEffect(() => { 
    
    handleSearchSubmit(); 
  
  }, [] ) 
  
  const searchLocation = async (event) => 
  {
    if (event.key === 'Enter') 
    {
      handleSearchSubmit();
    }
  }

  const handleSearchSubmit = async () =>
  {
    try
    {
      setLoading(true);
      // console.log('location=empty ', location==='');

      if(location !== '')
      { 
          setAutoSearch(false);          

          const url = `${api.base}/weather?q=${location}&units=${tempUnits}&appid=${api.key}`;
          axios.get(url).then((response) => 
          {
            console.log('search cityId:', response.data.id);
            setWeatherData(response.data);
            LoadForecastData(response.data.id); 

          });
  
          setLocation('');           
      }
      else
      {   
        setAutoSearch(true);
        console.log(tempUnits);
        
        GetLocation(tempUnits);  
            
        
        const curLocationData = JSON.parse(localStorage.getItem('curLocationWeather'));  
        if (curLocationData) 
        {   
          console.log('m_data', curLocationData.name);
          const city = curLocationData;         
          const cityId = city.id;        

          console.log('fc', cityId);

          setCurLocation(city);
          setWeatherData(curLocationData);

          LoadForecastData(cityId);  
          
          //console.log('local-forecasts', curLocationForecasts);
        }  

      } 
    }
    catch(err)
    {
      setError('Failed to fetch weather data');
      console.error('Error:', err);
    }
    finally 
    {
      setLoading(false);
    }
  
  }
  
  async function LoadForecastData(cityId)
  {
    const url = ` ${api.base}/forecast?id=${cityId}&appid=${api.key}&units=${tempUnits} `;

    await axios.get(url)
          .then(
              response => 
                  {
                      const data = response.data;
                      const forecasts = data.list;               
                      
                      if(isAutoSearching)
                        localStorage.setItem('curLocationForecasts', JSON.stringify(forecasts));  
                      //console.log('forecasts', forecasts);

                      setForecastData(forecasts);                   
                     
                  })
          .catch(error => {  console.error("Error fetching weather forecast data:", error);  });
  }  

  console.log('autoSearch', isAutoSearching);
  
  console.log('loading...', loading);

  return  (

    <div className='WeatherApp' id={ isDark ? "light" : "dark" }>
      
      <Header 
        isDark={isDark} setTheme={setTheme}
        tempUnits={tempUnits} setTempUnits={setTempUnits}
              
        handleSearchSubmit={handleSearchSubmit}
        searchLocation={searchLocation}
        location={location}  setLocation={setLocation}
      /> 
      { weatherData && <TempNother weatherData={weatherData} /> }

      { forecastData && <Container forecastData={forecastData}/> }


    </div>
  );
}

export default WeatherApp;
