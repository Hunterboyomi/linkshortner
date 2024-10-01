const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://linkshortnr.vercel.app',
    optionsSuccessStatus: 200
}));

// Connect to database
connectDB();

// API Routes - Make sure this comes before serving static files
app.use('/api', urlRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
