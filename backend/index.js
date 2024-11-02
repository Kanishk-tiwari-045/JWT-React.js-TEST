const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Update this to the specific frontend origin you want to allow
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Test endpoint to check if server is running
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Route handling with logging
app.use('/auth', (req, res, next) => {
    console.log(`[AUTH] ${req.method} request to ${req.originalUrl}`);
    next();
}, AuthRouter);

app.use('/products', (req, res, next) => {
    console.log(`[PRODUCTS] ${req.method} request to ${req.originalUrl}`);
    next();
}, ProductRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'An unexpected error occurred!',
        error: err.message
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
