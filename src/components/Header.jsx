import { useState } from 'react';
import { getCurrentDate } from '.';
import '../App.css';
import "./components.css";
import { measure_units } from './constants.js'

const Header = ({ isDark, setTheme, tempUnits, setTempUnits, handleSearchSubmit, searchLocation, location, setLocation}) =>
{
    //9728; &#127761; 
    const curDate = getCurrentDate();
    console.log('dt',curDate);

    const [openSettings, setOpenSettings] = useState(false);
    
    const handleMeasureUnits = (sys) =>
    {
        setTempUnits(sys);
        handleSearchSubmit();
        openSettings(false);
    }
    
    return(
        <div className="Header">
            <div className="logo-dt">
                <h2>Weather(24/7) </h2>
                <strong>{ curDate.day } , { curDate.time } </strong>
            </div>            
            
            <div className="search">                
                <input type="text" placeholder='Enter Location' value={ location }
                    onChange={ event => setLocation(event.target.value) }
                    onKeyDown={ searchLocation } />
                
                <div className="btn-h-group">
                    <button className='bm-loc-btn' 
                        onClick={handleSearchSubmit}>
                        <div className="icn">&#128205;</div>
                    </button>{/* &#128506; */}
                    
                    <button className='bm-search-btn' 
                        onClick={handleSearchSubmit}>
                        <div className="icn">&#128269;</div>
                    </button>
                </div>
            </div>

            <div className="settting">  
                <div className="btn-h-group">
                    { 
                        isDark ? <button onClick={() => { setTheme(!isDark) } }>
                                    <div className="icn">&#127768;</div>
                                </button> 
                        : <button onClick={() => { setTheme(!isDark) } }>
                            <div className="icn">&#127766;</div> 
                        </button> 
                    }                  
                    <button className={`setting-btn${openSettings ? '-fill' : ''}`}
                        onClick={() => {setOpenSettings((prev)=> !prev)}}          >
                        <div className="icn">&#128736;</div>
                    </button> {/*// &#128295;*/ }
                </div>
            </div>

            <div className={`setting-menu ${openSettings ? 'open' : ''}`}>
                <div>Set Measure Units:</div>
                <div className='systems'>
                    
                    {
                        Object.values(measure_units).map((sys) =>
                        (
                            <div className={`system ${sys===tempUnits ? "active" : ""}`} key={sys}
                                onClick={() => { handleMeasureUnits(sys) }} >
                                {sys} </div>
                        )) 
                    }
                </div>
            </div>
                    
        </div>        
    );
}

export default Header;