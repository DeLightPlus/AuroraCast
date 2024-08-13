//Hourly Forecast  
//http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}

//16 Days, Daily Forecast
//http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key} 

import './components.css';
import '../App.css';
import './index.js';
import weatherIcons from "./constants.js";
import { useEffect, useState } from 'react';
import { getCurrentDate } from './index.js';

const Forecast = ({ type, title, data }) => //
{
    console.log(type, data);
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    // const forecastDate = new Date(forecast.dt_txt);

    // if(data !== (undefined) || data.length > 0)
    //     console.log('fc', data.length )

    return(
        <div className="Forecasts">
            
            <strong>{title} </strong> 
            <ul>  

            {   data && type==='hourly' ? 
                (    
                    <div className='h-scroll'> 
                    {
                        data.map((h) => (                    
                        
                        <div key={h.dt} className="box" id='hourlyFC'>

                            { console.log('loading..', h.clouds.all )}
                            <div className="cloud">                                
                                    <div style={{ fontSize: '12px' }}>&#9925;</div>
                                    <strong style={{ fontSize: '10px' }}>{h.weather[0].main}</strong>  
                            </div>
                            <div className='fc_coverImg'> { weatherIcons[h.weather[0].icon] }</div>

                            <div>
                                <strong style={{ fontSize: '16px', textDecoration: 'overline',  }}> 
                                    &#127777;{h.main.temp.toFixed() }°C</strong>
                                    
                                <strong style={{ fontSize: '10px' }}>
                                    <div> &#128167; {h.main.humidity}%</div>  
                                    
                                    <div style={{ fontSize:'10px', display:'flex'}}>
                                        &#128168;{h.wind.speed} 
                                        <div style={{ fontSize: '8px' }}> mph </div>
                                        (
                                            <div style={{ fontSize:'11px', transform:`rotate(${h.wind.deg}deg)`}}>
                                                &#11165;
                                            </div>
                                        )
                                    </div>
                                    
                                </strong><hr/>
                                <h6 style={{ fontSize: '8px', textAlign:'center'}}>
                                    {new Date(h.dt * 1000).toLocaleString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        day: '2-digit',
                                        month: 'short',                                        
                                    })}
                                </h6>
                            </div>                       

                        </div>                  
                            
                        ))
                    }

                    </div>    
                ) :
                data && type==='daily' ? (
                    <div className='h-scroll'>
                    {
                       data.map((day) => (  
                        
                        <div key={day.dt} className="box" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px' }}>
                                { console.log(new Date(day.dt_txt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), ' | ', currentDate )                             }
                                { 
                                    new Date(day.dt_txt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) === currentDate ? 
                                    ( <strong> Today </strong>) : 
                                    ( <strong> { new Date(day.dt_txt).toLocaleDateString('en-GB', { weekday:'short', day: 'numeric', month: 'short' })}</strong> )
                                }
                            </div>

                            <div className='cloud'> 
                                <div className='fc_coverImg'> { weatherIcons[day.weather[0].icon] } </div>
                            </div>
                            <h4> <sup>&#127777;</sup>  {day.main.temp_max.toFixed() }°C </h4>
                            
                            <strong style={{ fontSize: '10px' }}> {day.weather[0].description}</strong>

                        </div>
                       ))
                    }
                    </div>
                ):( <div>No data available</div>)
            } 
                         
            </ul>
        </div>
    )
}

export default Forecast;

