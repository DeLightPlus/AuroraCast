import { useState } from "react";
import weatherIcons from "./constants.js";

const TempNother = ({ weatherData }) => {
    // { console.log('weatherData', weatherData) }      

    return (
        <div className="grid-item" >

            <div className="TempNotherDetails">
                <div className="title">
                    <h1>{weatherData.name}, {weatherData.sys.country} </h1>
                </div>                

                <div className="tempNclouds">
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div className="cloud">
                            {weatherData.weather ? <p> {weatherData.weather[0].main}</p> : null}
                            <div>
                                <div className="description">
                                    {weatherData.weather ? <div className='coverImg'> {weatherIcons[weatherData.weather[0].icon]} </div> : null}
                                    {
                                        weatherData.weather ?
                                        (
                                            <strong id='cover-dir'>
                                                <div className="wind-dir"
                                                    style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}>
                                                    &#11165;
                                                </div>
                                                <div className="cloud-des">    
                                                    {weatherData.weather[0].description}
                                                    <div> &#9925; {weatherData.clouds.all}%</div>
                                                </div>
                                                
                                                
                                            </strong>

                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                        {/* <strong>Very Cold</strong>             */}
                    </div>

                    <div className="feels-like">
                        <div className="temp">
                            {weatherData.main ? <h1> {weatherData.main.temp.toFixed()}°C </h1> : null}
                        </div>

                        <div className="feels">
                            {weatherData.main ? <>Feels Like: <strong className='bold'>{weatherData.main.feels_like.toFixed()}°C</strong></> : null}
                        </div>
                    </div>
                </div>

                {
                    weatherData.name !== undefined &&
                    <div className="highligts-container">
                        <div className="highlights">

                            <div className="hl-box">
                                {weatherData.main ?
                                    <>
                                        <div className="h-block">
                                            <div className="h"> &#127777; Max</div>
                                            <div className="body"> 
                                                <p> {weatherData.main.temp_max.toFixed()}°C </p>
                                            </div>
                                        </div>
                                    </> : null}
                            </div>

                            <div className="hl-box">
                                {
                                    weatherData.wind ?
                                        <>
                                            <div className="h-block">
                                                <div className="h"> &#127777; Min</div>
                                                <div className="body"> 
                                                    <p>  {weatherData.main.temp_min.toFixed()}°C </p>
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
                                                <div className="h"> &#128167; Humidity</div>
                                                <div className="body">
                                                    <p> {weatherData.main.humidity}% </p>
                                                </div>
                                            </div>
                                        </> : null
                                }
                            </div>

                            <div className="hl-box">
                                {weatherData.wind ?
                                    <>
                                        <div className="h-block">
                                            <div className="h"> &#128065; Visibility</div>
                                            <div className="body"> 
                                                <p>  {(weatherData.visibility / 1000).toFixed(1)}km </p>
                                            </div>
                                        </div>
                                    </> : null}
                            </div>

                            <div className="hl-box">
                                {
                                    weatherData.main ?
                                        <>
                                            <div className="h-block">
                                                <div className="h"> &#9202; Pressure</div>
                                                <div className="body"> 
                                                    <p> {weatherData.main.pressure} </p>
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
                                                <div className="h"> &#128168; Wind Speed</div>
                                                <div className="body"> 
                                                    <p>  {weatherData.wind.speed.toFixed()} MPH </p>
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