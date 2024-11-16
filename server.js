const express = require('express');
const path = require('path'); // Corrected this line
const app = express();
const port = 3000; // Or any port you prefer

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the src folder (if needed)
app.use(express.static(path.join(__dirname, 'src')));

// Fallback to index.html for any unknown routes (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});