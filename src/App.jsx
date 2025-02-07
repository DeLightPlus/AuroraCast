import './App.css';
import './components/components.css';

import { FaSearch } from "react-icons/fa";


import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header/Header.jsx';

import { measure_units } from './components/constants.js';
import CookieConsent from './components/CookiesConsent.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import GetLocation, { LoadForecastData } from './api/api.js';
import TempNother from './components/TemperatureNother.jsx';
import WeatherInsights from './api/WeatherInsights.js';
import Forecast from './components/Forecast.jsx';


const api = {
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
};

const WeatherApp = () => {
  const [isDark, setTheme] = useState(true);
  const [isAutoSearching, setAutoSearch] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(true);
  const [tempUnits, setTempUnits] = useState(measure_units.metric);

  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState([]);


  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {    

    if (useLocalStorage) 
    {
      loadLocalWeatherData();
    }
  }, [useLocalStorage]);


  const loadLocalWeatherData = () => {
    const curLocationData = JSON.parse(localStorage.getItem('curLocationWeather'));
    if (curLocationData) 
    {
      setWeatherData(curLocationData);
      // console.log(curLocationData.name);        
      LoadForecastData(curLocationData.name, true);
    }
  };

  const LoadForecastData = async (loc, save) => {
    console.log(loc);
    
    try 
    {
      const forecastResponse = await axios.get(`${api.base}/forecast?q=${loc}&appid=${api.key}&units=${tempUnits}`);
      const forecasts = forecastResponse.data.list;
      console.log(forecasts);;

      if (save) 
      {
        localStorage.setItem('curLocationForecasts', JSON.stringify(forecasts));
      }

      setForecastData(forecasts)

      return forecasts;

    } 
    catch (error) 
    {
      console.error("Error fetching weather forecast data:", error);
    }
  };

  const useCurrentLocation = () =>
  {
      console.log('use currentLocation');
      handleSearchSubmit();

  } 

    const [isOpen, setIsOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState("")

    const locations = ['Polokwane', 'Cape Town', 'Johannesburg']; // Add more locations as needed

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (loc) => 
    {
        console.log(loc);
        
        setSelectedLocation(loc);
        setIsOpen(false);
        handleSearch(loc);        
    };

    const handleSearch = (loc) =>
    {
        console.log('handleSearch', loc);
        setSearchQuery(loc);
        handleSearchSubmit(loc);
    }

    const handleSearchSubmit = async (loc) => 
    {    
      try 
      {
        if (loc) 
        {
          console.log('loc:',loc);
          const weatherResponse = await axios.get(`${api.base}/weather?q=${loc}&units=${tempUnits}&appid=${api.key}`);
          
          setWeatherData(weatherResponse.data);              
        } 
        else 
        {
          console.log('location!!: ',loc);
          await GetLocation(tempUnits);
          loadLocalWeatherData();        
        }
      }
      catch (err)
      {
        setError('Failed to fetch weather data');
        console.error('Error:', err);
      } finally {    setLoading(false);   }
    };

   

  return (
    // <div className='WeatherApp' id={isDark ? "light" : "dark"}> 
    //   <div className="Main">
    //     <div className="location">
    //                   <p>{ weatherData.name }</p>
    //                   <div className='bm-save-btn'>
    //                           {weatherData.weather && <button > <div className='icn'>&#128278;</div> </button>}
    //                   </div>
    //     </div>
    //   </div>
    // </div>

    <div className="grid-container">
      {/* Header */}
      <Header 
        isDark={isDark} 
        setTheme={setTheme}
        tempUnits={tempUnits} 
        setTempUnits={setTempUnits}
        weatherData={weatherData}
        showTermsOfService={showTermsOfService}
        setShowTermsOfService={setShowTermsOfService}
      />
       
      {/* Column 1 */}
      <div className="grid-column-1">

        <div className="column1-header"> 

          <div className="search-container">
              <div className="loc-pin-container">             
                📍
              </div>
              <input className="search-input"
                type="text" placeholder='Enter Location' 
                value={ searchQuery }
                onChange={(event) => {
                  const value = event.target.value;                    
                    if (/^[A-Za-z\s]*$/.test(value)) 
                    {
                      setSearchQuery(value);
                    }
                  }}

                onKeyDown={ (event) => {
                    if (event.key === 'Enter') 
                    {
                      console.log(event.target.value);
                      handleSearch(event.target.value);                                
                    }
                } } 
              />
              <button className='search-icon'>
                <div className="icn">🔍</div>
              </button>
              <div className="search">             
           
                <div className="custom-dropdown" onClick={toggleDropdown}>
                    <div className="selected">
                        SetLocation
                        <span className="dropdown-arrow">&#9662;</span>
                    </div>
                    {isOpen && (
                        <div className="dropdown-list">
                            {locations.map((location, index) => (
                                <div 
                                    key={index} 
                                    className="dropdown-item" 
                                    onClick={() => handleSelect(location)}
                                >
                                    {location}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            
          </div> 
          </div>          
        </div>

        <div className="column1-body1">
        {
          weatherData && 
            <TempNother 
              useCurrentLocation={useCurrentLocation}
              handleSearchSubmit={handleSearchSubmit}
              weatherData={weatherData}
            /> }
        </div>

        <div className="column1-body2">  
          <div className="daily">
            { forecastData.length > 0 && <Forecast type='daily' title='Next 4 DAYS FORECAST' data={ forecastData } /> }                
          </div>
        </div>       
      </div>

      {/* Column 2 (Aside) */}
      <aside className="grid-column-2">
        <div className="hourly">
          { forecastData.length > 0 && <Forecast type='hourly' title='Next 4 HOURS FORECAST' data={ forecastData } /> }                
        </div>        
      </aside>

      <CookieConsent setShowTermsOfService={setShowTermsOfService}/>
        { showTermsOfService && <TermsOfService setShowTermsOfService={setShowTermsOfService}/> }

    </div>
  );
};

export default WeatherApp;