import React from 'react'
import './WeatherCardMini.css'

const WeatherCard = () => {
    return (
        <div className="cardm">
            <div className="card"> 
                <div className="mainsub"> Polokwane 🌤 </div>
                <div className="main"> 23 °C </div>
                <div style={{fontWeight: 800}}>⁝</div>
            </div>            
        </div>
    )
}

export default WeatherCard