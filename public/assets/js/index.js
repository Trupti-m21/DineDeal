import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from '../../../src/App';
import reportWebVitals from '../../../src/reportWebVitals';

//const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
 // <React.StrictMode>
 //   <App />
 // </React.StrictMode>
// );

//reportWebVitals();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const locationElement = document.querySelector('currentLocation');
      if (locationElement) {
        locationElement.textContent = `Lat: ${latitude}, Long: ${longitude}`;
      } else {
        console.warn('#currentLocation element not found.');
      }
    },
    (error) => {
      console.error('Error fetching location:', error);
      const locationElement = document.querySelector('currentLocation');
      if (locationElement) {
        locationElement.textContent = 'Unable to fetch location.';
      }
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert('Permission denied. Please allow location access in your browser.');
          break;
        case error.POSITION_UNAVAILABLE:
          alert('Position unavailable. Please try again.');
          break;
        case error.TIMEOUT:
          alert('Request timed out. Try again.');
          break;
        default:
          alert('An unknown error occurred.');
      }
    }
  );
} else {
  const locationElement = document.querySelector('currentLocation');
  if (locationElement) {
    locationElement.textContent = 'Geolocation is not supported by your browser.';
  }
  alert('Geolocation is not supported by your browser.');
}





