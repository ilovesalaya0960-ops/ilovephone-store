const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const newDevicesRoutes = require('./routes/newDevices');
const usedDevicesRoutes = require('./routes/usedDevices');
const repairsRoutes = require('./routes/repairs');
const installmentRoutes = require('./routes/installments');
const pawnRoutes = require('./routes/pawn');
const pawnInterestRoutes = require('./routes/pawnInterestTransactions');
const accessoriesRoutes = require('./routes/accessories');
const equipmentRoutes = require('./routes/equipment');

// Use routes
app.use('/api/new-devices', newDevicesRoutes);
app.use('/api/used-devices', usedDevicesRoutes);
app.use('/api/repairs', repairsRoutes);
app.use('/api/installments', installmentRoutes);
app.use('/api/pawn', pawnRoutes);
app.use('/api/pawn-interest', pawnInterestRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/equipment', equipmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'I Love Phone Management API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to I Love Phone Management API',
        version: '1.0.0',
        endpoints: {
            newDevices: '/api/new-devices',
            usedDevices: '/api/used-devices',
            repairs: '/api/repairs',
            installments: '/api/installments',
            pawn: '/api/pawn',
            accessories: '/api/accessories',
            equipment: '/api/equipment',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 Server started successfully');
    console.log(`📡 API running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=================================');
});

module.exports = app;
