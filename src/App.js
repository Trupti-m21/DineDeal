import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Login from './login';


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust debounce delay as needed
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/search?term=${debouncedSearchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  };

  return (
    <Router>
      <div>
        <h1>Welcome to DineDeal</h1>

        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />

        {/* Search functionality */}
        <div>
          <h2>Search Food Items</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Set search term state
            placeholder="Enter food name"
          />
          <button onClick={handleSearch}>Search</button>

          {/* Loading indicator */}
          {loading && <p>Loading...</p>}

          {/* Error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Display results */}
          <div>
            {results.length > 0 ? (
              results.map((item, index) => (
                <div key={index} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                  {item.image && <img src={`path/to/images/${item.image}`} alt={item.Item_Name} style={{ width: '100px', height: '100px' }} />}
                  <h3>{item.Item_Name}</h3>
                  <p><strong>Restaurant: </strong>{item.RestaurantName}</p>
                  <p>Price: ${item.Cost}</p>
                </div>
              ))
            ) : (
              !loading && <p>No results found. Try searching for a different item.</p>
            )}
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
