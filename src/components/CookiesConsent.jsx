import React, { useState } from 'react';
import './cookiesNterms.css';
import { useAppContext } from '../context/AppContext.jsx'; // Correct import

const CookieConsent = () => {
  const { cookieConsent, setCookieConsent, setShowTermsOfService } = useAppContext();
  const [isVisible, setIsVisible] = useState(true);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(true));
    setIsVisible(false);
    setCookieConsent(true);
  };

  // Check if the user has already accepted cookies
  const hasConsented = localStorage.getItem('cookieConsent');
  if (hasConsented && JSON.parse(hasConsented) === true) {
    return null;
  }

  return (
    isVisible && (
      <div className="cookie-consent-banner">
        <p>
          We use cookies to improve your experience on our site. By using our app, you consent to our use of cookies.
          <br /><span>Read our <button onClick={() => setShowTermsOfService(true)}>terms of service.</button></span>
        </p>
        <button onClick={handleAcceptCookies}>Accept</button>
      </div>
    )
  );
};

export default CookieConsent;
