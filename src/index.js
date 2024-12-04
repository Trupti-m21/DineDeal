import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';

// Rendering the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);



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





