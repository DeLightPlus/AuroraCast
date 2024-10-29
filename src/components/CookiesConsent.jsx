import React, { useState } from 'react';
import './cookiesNterms.css'
import { Link } from 'react-router-dom';

const CookieConsent = ({setShowTermsOfService}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleAcceptCookies = () => {
        // Set a cookie or localStorage item to remember the user's choice
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    // Check if the user has already accepted cookies
    const hasConsented = localStorage.getItem('cookieConsent');

    if (hasConsented) {
        return null; // Don't show the banner if consent has already been given
    }

    return (
        isVisible && (
            <div className="cookie-consent-banner">
                <p>
                    We use cookies to improve your experience on our site. By using our app, you consent to our use of cookies.
                    <br /><p>Read our <button onClick={()=>{setShowTermsOfService(true )}}>terms of service.</button></p>
                </p>
                <button onClick={handleAcceptCookies}>Accept</button>
            </div>
        )
    );
};

export default CookieConsent;
