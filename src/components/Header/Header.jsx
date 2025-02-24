import { useState } from 'react';

import './Header.css';
import { measure_units } from '../constants.js'
import { getCurrentDate } from '../../api/api.js';
import DarkModeToggle from '../Switchs/DarkmodeToggle.jsx';
import TemperatureToggle from '../Switchs/TemperatureToggle.jsx';


const Header = ({
    isDark, setTheme,
    tempUnits, setTempUnits,
    showTermsOfService,
    setShowTermsOfService }) => {
   
    const curDate = getCurrentDate();
    console.log('dt', curDate);

    const [openSettings, setOpenSettings] = useState(false);

    const handleMeasureUnits = (sys) => {
        setTempUnits(sys);
        handleSearchSubmit();
        openSettings(false);
    }

    return (
        <div className="Header">
            <div className="logo-dt">
                <h2>Weather(24/7) </h2>
                <strong>{curDate.day} , {curDate.time} </strong>
            </div>

            <div className="settting">
                <div className="btn-h-group">
                    <DarkModeToggle />

                    <div className={`btn-cont${openSettings ? '-fill' : ''}`}>
                        <button className={`setting-btn${openSettings ? '-fill' : ''}`}
                            onClick={() => { setOpenSettings((prev) => !prev) }}          >
                            <svg
                                class="settings-btn"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 -960 960 960"
                                width="24"
                                fill="#e8eaed"
                            >
                                <path
                                    d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 ```html
99t99.5 41Zm-2-140Z"
                                ></path>
                            </svg>
                            <span class="tooltip">settings</span>
                        </button> {/*// &#128295;*/}
                    </div>
                </div>

            </div>

            <div className={`setting-menu ${openSettings ? 'open' : ''}`}>

                <TemperatureToggle />

                <div>
                    <a onClick={() => { setShowTermsOfService(!showTermsOfService) }}>
                        Terms of service
                    </a>
                </div>
            </div>



        </div>
    );
}

export default Header;