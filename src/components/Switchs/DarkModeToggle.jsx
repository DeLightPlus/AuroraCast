import React from 'react'
import './DarkModeToggle.css'

const DarkModeToggle = () => {
  return (
    <label className="ui-switch">
        <input type="checkbox" />
        <div className="slider">
            <div className="circle"></div>
        </div>
    </label>
    
  )
}

export default DarkModeToggle