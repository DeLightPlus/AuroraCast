import { useState } from "react";
import weatherIcons from "./constants.js";

const TempNother = ({ weatherData }) =>
{
    // { console.log('weatherData', weatherData) }      
    
    return(
        <div className="grid-item" >         

            <div className="TempNotherDetails">
                <div className="tempNclouds">            
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>                          
                        <h1>{weatherData.name}</h1>

                        <div className="cloud">                            


                            { weatherData.weather ? <p> { weatherData.weather[0].main }</p> : null }    
                            <div>
                                
                                <div className="description">
                                
                                    { weatherData.weather ?<div className='coverImg'> { weatherIcons[weatherData.weather[0].icon] } </div>  : null }                         
                                    { 
                                        weatherData.weather ? 
                                        (
                                            <strong id='cover-dir'>                                           

                                                { weatherData.weather[0].description }  
                                                <div className="wind-dir" 
                                                    style={{ transform:`rotate(${weatherData.wind.deg}deg)`}}>
                                                &#11165;</div>
                                                <div> &#9925; {weatherData.clouds.all}%</div>
                                            </strong> 
                                                                            
                                        ) : null 
                                    }
                                </div>

                            </div>
                        </div>                    
                        {/* <strong>Very Cold</strong>             */}
                    </div>

                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                        <div className="temp">
                            { weatherData.main ? <h1> { weatherData.main.temp.toFixed() }°C </h1> : null }
                        </div>                                

                        <div className="feels">                            
                            { weatherData.main ? <>Feels Like: <strong className='bold'>{ weatherData.main.feels_like.toFixed() }°C</strong></> : null }
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
                                <div className="h-block"> 
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
                                <div className="h-block"> 
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
                                <div className="h-block"> 
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
                                <div className="h-block"> 
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
                                <div className="h-block"> 
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
                                <div className="h-block"> 
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
            </div>
             
        </div>
    )
}

export default TempNother;