import { useState, useCallback } from "react";
import "./Header.css";
import { getCurrentDate } from "../../api/api.js";
import DarkModeToggle from "../Switches/DarkModeToggle.jsx";
import TemperatureToggle from "../Switches/TemperatureToggle.jsx";
import { Setting2 } from "iconsax-react";

const Header = ({ 
  setTempUnits, 
  setShowTermsOfService 
}) => {
  const [openSettings, setOpenSettings] = useState(false);
  const curDate = getCurrentDate();

  const handleTemperatureChange = useCallback((units) => {
    setTempUnits(units);
    setOpenSettings(false);
  }, [setTempUnits]);

  const toggleSettings = useCallback(() => {
    setOpenSettings(prev => !prev);
  }, []);

  const toggleTermsOfService = useCallback(() => {
    setShowTermsOfService(prev => !prev);
    setOpenSettings(false);
  }, [setShowTermsOfService]);

  return (
    <header className="header">
      <div className="header__brand">
        <h2 className="header__title">Weather(24/7)</h2>
        <span className="header__datetime">
          {curDate.day} , {curDate.time}
        </span>
      </div>

      <button 
        className="header__menu-button"
        onClick={toggleSettings}
        aria-label="Toggle menu"
      >
        <span className="header__menu-icon">☰</span>
      </button>

      <nav className={`header__nav ${openSettings ? 'header__nav--open' : ''}`}>
        <div className="header__controls">
          <DarkModeToggle />
          <button
            className="header__settings-button"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <Setting2 size="32" color="#ffff" />
            <span className="header__tooltip">Settings</span>
          </button>
        </div>
      </nav>

      <div className={`header__dropdown ${openSettings ? 'header__dropdown--open' : ''}`}>
        <TemperatureToggle onChange={handleTemperatureChange} />
        <button
          className="header__terms-button"
          onClick={toggleTermsOfService}
        >
          Terms of Service
        </button>
      </div>
    </header>
  );
};

export default Header;