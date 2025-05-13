import React from 'react'
import './WeatherCardMini.css'

const WeatherCard = ({name}) => {
    return (
        <div className="cardm">
            <div className="card__icon">⛅</div>
            <div className="card__details">
                <h3>{name}</h3>
                <p>20℃</p>
            </div>
            <div className="card__menu">⁝</div>
        </div>
    )
}

export default WeatherCard