import { useState } from "react";
import weatherIcons from "./constants.js";
import Forecast from "./Forecast.jsx";
const TempNother = ({ 
    useCurrentLocation,
    handleSearchSubmit, 
    weatherData, daily }) =>
{
    // { console.log('weatherData', weatherData) }    
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
    
    return(
        <div className="r-aside">         

            <div className="TempNotherDetails">                

                <div className="search">  
                    <div className="loc-pin-container">
                        <button className='bm-loc-btn' 
                                onClick={() => { useCurrentLocation() } }
                        ><div className="icn">&#128205;</div>
                        </button>
                        {/* &#128506; */}
                    </div> 


                    <input type="text" placeholder='Enter Location' value={ searchQuery }
                        onChange={ (event) => setSearchQuery(event.target.value) }
                        onKeyDown={ (event) => {
                            if (event.key === 'Enter') 
                            {
                                console.log(event.target.value);
                                handleSearch(event.target.value);                                
                            }
                        } } 
                    />      


                    <div className="loc-select-container">
                        <div className="custom-dropdown" onClick={toggleDropdown}>
                            <div className="selected">
                                {/* {selectedLocation || "Select Location"} */}
                                <span className="dropdown-arrow">&#9662;</span> {/* Dropdown arrow */}
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

                <div className="tempNclouds">            
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>                          

                        <div className="temp">
                            { weatherData.main ? <h1> { weatherData.main.temp.toFixed() }°C </h1> : null }
                        </div>                                

                        <div className="feels">                            
                            { weatherData.main ? <>Feels Like: <strong className='bold'>{ weatherData.main.feels_like.toFixed() }°C</strong></> : null }
                        </div>                 
                    </div>          

                    <div className="cloud"> 
                        <span style={{
                            marginInline : "4px",
                        }}/>
                        { weatherData.weather ? <p> { weatherData.weather[0].main }</p> : null }    
                        <div>
                            
                            <div className="description">
                            
                                { weatherData.weather ?<div className='coverImg'> { weatherIcons[weatherData.weather[0].icon] } </div>  : null }                         
                                { 
                                    weatherData.weather ? 
                                    (
                                        <strong id='cover-dir'> 
                                            <div> &#9925; {weatherData.clouds.all}%</div>

                                            { weatherData.weather[0].description }  
                                            <div className="wind-dir" 
                                                style={{ transform:`rotate(${weatherData.wind.deg}deg)`}}>
                                            &#11165;</div>
                                        </strong>                                 
                                    ) : null 
                                }
                            </div>

                        </div>
                    </div> 
                </div>

                {
                    weatherData.name !== undefined &&
                    <div className="highligts-container">
                        <div className="highlights">                                  
                        
                            <div className="hl-box">
                            { weatherData.main ? 
                                <> 
                                    <div style={{display:'flex', alignItems:'center'}}> 
                                        <div style={{fontSize:'18px'}}> &#127777; </div> 
                                        <div style={{ alignItems:'end'}}> Max
                                            <p className='bold'> { weatherData.main.temp_max.toFixed() }°C </p> 
                                        </div>
                                    </div> 
                                </> : null}
                            </div>

                            <div className="hl-box">
                            { 
                                weatherData.wind ? 
                                <>
                                    <div style={{display:'flex', alignItems:'center', textAlign:'center'}}> 
                                        <div style={{ fontSize:'18px' }}> &#127777;</div> 
                                        <div style={{ textAlign:'center'}}> Min 
                                            <p className='bold'>  { weatherData.main.temp_min.toFixed() }°C </p>     
                                        </div>
                                    </div>
                                </> : null 
                            }              
                            </div>

                            <div className="hl-box">
                            { 
                                weatherData.main ? 
                                <> 
                                    <div style={{display:'flex', alignItems:'center'}}> 
                                        <div style={{fontSize:'18px'}}> &#128167; </div> 
                                        <div style={{ alignItems:'end'}}> Humidity 
                                            <p className='bold'> { weatherData.main.humidity } % </p> 
                                        </div>
                                    </div> 
                                </> : null
                            }
                            </div>
                        </div>

                        <div className="highlights">                                   
                            <div className="hl-box">
                            { weatherData.wind ? 
                                <>
                                    <div style={{display:'flex', alignItems:'center', textAlign:'right'}}> 
                                        <div style={{ fontSize:'18px' }}> &#128065;</div> 
                                        <div style={{ textAlign:'right'}}> Visibility 
                                            <p className='bold'>  { (weatherData.visibility/1000).toFixed(1) }km </p>     
                                        </div>
                                    </div>
                                </> : null }              
                            </div>

                            <div className="hl-box">
                            { 
                                weatherData.main ? 
                                <> 
                                    <div style={{display:'flex', alignItems:'center'}}> 
                                        <div style={{fontSize:'18px'}}> &#9202; </div> 
                                        <div style={{ alignItems:'end'}}> Pressure 
                                            <p className='bold'> { weatherData.main.pressure }  </p> 
                                        </div>
                                    </div> 
                                </> : null
                            }
                            </div>                       

                            <div className="hl-box">
                            {
                            weatherData.wind ? 
                                <>
                                    <div style={{display:'flex', alignItems:'center', textAlign:'right'}}> 
                                        <div style={{ fontSize:'18px' }}> &#128168;</div> 
                                        <div style={{ textAlign:'right'}}> Wind Speed 
                                            <p className='bold'>  { weatherData.wind.speed.toFixed() } MPH </p>     
                                        </div>
                                    </div>
                                </> : null 
                            }              
                            </div>

                        </div>
                    </div> 
                }
                <br/>

                <div className="daily">
                    { daily.length > 0 && <Forecast type='daily' title='Next 4 DAYS FORECAST' data={ daily } /> }                
                </div>
                
            </div>

             
        </div>
    )
}

export default TempNother;