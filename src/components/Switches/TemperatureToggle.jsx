import React from 'react'
import './TemperatureToggle.css'

const TemperatureToggle = () => {
    return (
        <div className="toggle-button-cover">
            <div className="button r" id="button-3">
                <input type="checkbox" className="checkbox" />
                <div className="knobs"></div>
                <div className="layer"></div>
            </div>
        </div>
    )
}

export default TemperatureToggle