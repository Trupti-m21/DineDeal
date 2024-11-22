const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Use CORS to allow cross-origin requests
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' // Adjust based on frontend hosting
}));

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection pool for efficient resource management
const pool = mysql.createPool({
    host: process.env.DB_HOST, // e.g., dinedeal-db.cjs0ssiwsf2c.us-east-1.rds.amazonaws.com
    user: process.env.DB_USER, // e.g., admin
    password: process.env.DB_PASSWORD, // e.g., Vclass123$
    database: process.env.DB_NAME, // e.g., dinedeal
    port: process.env.DB_PORT || 3306, // Default MySQL port
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on expected traffic
    queueLimit: 0
});

// API route to search for food items in the database
app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    console.log("Search Term:", searchTerm);

    if (!searchTerm) {
        return res.status(400).send('Search term is required');
    }

    const query = 'SELECT item_name, item_description, cost, Restaurant_Name FROM main_table WHERE item_name LIKE ?';
    const values = [`%${searchTerm}%`];

    try {
        const [results] = await pool.query(query, values);
        console.log('Query results:', results);
        res.json(results);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Internal server error');
    }
});

// Fallback to index.html for any unknown routes (optional for SPAs)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
