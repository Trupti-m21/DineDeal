// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies in incoming requests
app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'restaurant_comparison',
  password: 'Capstone@24',
  database: 'Restaurant Comparison'
});

// Attempt to connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Define API endpoints

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  const query = 'SELECT * FROM restaurants';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a specific restaurant by ID
app.get('/api/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Update a restaurant
app.put('/api/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const { name, menu, price, reviews } = req.body;
  const query = 'UPDATE restaurants SET name = ?, menu = ?, price = ?, reviews = ? WHERE id = ?';
  db.query(query, [name, menu, price, reviews, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Restaurant updated successfully' });
  });
});

// Add a new restaurant
app.post('/api/restaurants', (req, res) => {
  const { name, menu, price, reviews } = req.body;
  const query = 'INSERT INTO restaurants (name, menu, price, reviews) VALUES (?, ?, ?, ?)';
  db.query(query, [name, menu, price, reviews], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Restaurant added successfully', id: result.insertId });
  });
});

// Delete a restaurant
app.delete('/api/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM restaurants WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Restaurant deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});