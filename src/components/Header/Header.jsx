import { useState } from "react";

import "./Header.css";
import { measure_units } from "../constants.js";
import { getCurrentDate } from "../../api/api.js";
import DarkModeToggle from "../Switches/DarkModeToggle.jsx";
import TemperatureToggle from "../Switches/TemperatureToggle.jsx";
import { Setting2 } from "iconsax-react";

const Header = ({
    isDark,
    setTheme,
    tempUnits,
    setTempUnits,
    showTermsOfService,
    setShowTermsOfService,
}) => {
    const curDate = getCurrentDate();
    console.log("dt", curDate);

    const [openSettings, setOpenSettings] = useState(false);

    const handleMeasureUnits = (sys) => {
        setTempUnits(sys);
        handleSearchSubmit();
        openSettings(false);
    };

    return (
        <div className="Header">
            <div className="logo-dt">
                <h2>Weather(24/7) </h2>
                <strong>
                    {curDate.day} , {curDate.time}{" "}
                </strong>
            </div>

            <div className="settting">
                <div className="btn-h-group">
                    <DarkModeToggle />

                    <div className={`btn-cont${openSettings ? "-fill" : ""}`}>
                        <button
                            className={`setting-btn${openSettings ? "-fill" : ""}`}
                            onClick={() => {
                                setOpenSettings((prev) => !prev);
                            }}
                        >
                            <Setting2
                                className="settings-btn"
                                size="32"
                                color="#ffff"
                            />
                            <span className="tooltip">settings</span>
                        </button>{" "}
                        {/*// &#128295;*/}
                    </div>
                </div>
            </div>

            <div className={`setting-menu ${openSettings ? "open" : ""}`}>
                <TemperatureToggle />
                <div>
                    <a
                        onClick={() => {
                            setShowTermsOfService(!showTermsOfService);
                        }}
                    >
                        Terms of service
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Header;
