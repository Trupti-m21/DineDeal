import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';  // Ensure this is correctly imported
import { GoogleLogin } from '@react-oauth/google';

function App() {
  return (
    <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>

);
  
}

export default App;  // Make sure to include this line to export the App component
