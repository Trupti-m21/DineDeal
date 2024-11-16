import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

window.onload = function() {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
      document.getElementById('userGreeting').classList.remove('d-none');
      document.getElementById('username').textContent = storedUsername;
      document.getElementById('socialLoginButtons').style.display = 'none';
  }
};

document.getElementById('logoutButton').addEventListener('click', function() {
  localStorage.removeItem('username');
  window.location.reload();
});


