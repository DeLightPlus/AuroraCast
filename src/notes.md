import React from 'react';
import './Layout.css'; // Importing the corresponding CSS file

const Layout = () => {
  return (
    <div className="container">
      <header className="header">Main Header</header>
      <div className="content">
        <div className="sidebar">Left Column</div>
        <div className="main-content">Main Content (ChatGPT-like)</div>
        <div className="right-column">Right Column</div>
      </div>
      <footer className="footer">Footer</footer>
    </div>
  );
};

export default Layout;

/* Layout.css */

/* General layout styles */
.container {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Header, content, footer */
  grid-template-columns: 1fr; /* Single column for now to accommodate fixed sidebar */
  height: 100vh; /* Full viewport height */
}

.header {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  width: 100vw; /* 100% viewport width */
}

.content {
  display: grid;
  grid-template-columns: 8% 50% 340px; /* Left: 8%, Center: 50%, Right: 340px */
  grid-template-rows: auto; /* No specific row height */
  height: 100%;
  margin-top: 20px;
}

.sidebar {
  background-color: #f4f4f4;
  position: fixed; /* Fixed behavior */
  top: 100px; /* Adjust to align below the header */
  left: 0;
  width: 8%;
  height: calc(100vh - 100px); /* Height minus the header height */
  padding: 10px;
}

.main-content {
  background-color: #fff;
  margin-left: 8%; /* Space for the sidebar */
  margin-right: 340px; /* Space for the right column */
  padding: 20px;
  text-align: center;
}

.right-column {
  background-color: #e0e0e0;
  width: 340px;
  padding: 20px;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
  width: 100vw; /* 100% viewport width */
}

@media (max-width: 1200px) {
  .content {
    grid-template-columns: 12% 60% 30%; /* Slightly adjust for smaller screen */
  }
  .sidebar {
    position: static; /* Remove fixed behavior for smaller screens */
    width: 12%; /* Adjust sidebar width for smaller screens */
  }
  .main-content {
    margin-left: 12%; /* Adjust space for the sidebar */
    margin-right: 30%; /* Adjust for the right column */
  }
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 100%; /* Stack columns for smaller screens */
  }
  .sidebar,
  .right-column {
    display: none; /* Hide the sidebar and right column on smaller screens */
  }
  .main-content {
    margin: 0;
    width: 100%;
  }
}



----------------------------------------------------------------------
<!-- From Uiverse.io by JaydipPrajapati1910  | location loader-->  
<div class="loader"></div>

/* From Uiverse.io by JaydipPrajapati1910 */ 
.loader {
  width: 44.8px;
  height: 44.8px;
  position: relative;
  transform: rotate(45deg);
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50% 50% 0 50%;
  background: #0000;
  background-image: radial-gradient(circle 11.2px at 50% 50%,#0000 94%, #ff4747);
}

.loader:after {
  animation: pulse-ytk0dhmd 1s infinite;
  transform: perspective(336px) translateZ(0px);
}

@keyframes pulse-ytk0dhmd {
  to {
    transform: perspective(336px) translateZ(168px);
    opacity: 0;
  }
}
  
