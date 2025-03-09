import React from 'react';
import './SkeletonLoader.css'; // Import the CSS file for styling

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-texts">
        <div className="skeleton-line skeleton-line-short"></div>
        <div className="skeleton-line skeleton-line-long"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
