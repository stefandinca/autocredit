/**
 * Autocredit Romania - Backend Server
 * Provides API endpoints for managing car inventory
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CARS_FILE = path.join(__dirname, 'data', 'cars.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

/**
 * GET /api/cars
 * Retrieve all cars from the JSON file
 */
app.get('/api/cars', (req, res) => {
    try {
        const data = fs.readFileSync(CARS_FILE, 'utf8');
        const cars = JSON.parse(data);
        res.json(cars);
    } catch (error) {
        console.error('Error reading cars file:', error);
        res.status(500).json({ error: 'Failed to read cars data' });
    }
});

/**
 * POST /api/cars
 * Save all cars to the JSON file
 */
app.post('/api/cars', (req, res) => {
    try {
        const cars = req.body;

        // Validate the data
        if (!Array.isArray(cars)) {
            return res.status(400).json({ error: 'Invalid data format - expected an array' });
        }

        // Validate each car object
        for (const car of cars) {
            if (!car.id || !car.make || !car.model) {
                return res.status(400).json({
                    error: 'Invalid car data - missing required fields (id, make, model)'
                });
            }
        }

        // Write to file with pretty formatting
        fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 4), 'utf8');

        console.log(`Successfully saved ${cars.length} cars to file`);
        res.json({
            success: true,
            message: `${cars.length} cars saved successfully`,
            count: cars.length
        });
    } catch (error) {
        console.error('Error writing cars file:', error);
        res.status(500).json({ error: 'Failed to save cars data' });
    }
});

/**
 * GET /api/cars/:id
 * Get a specific car by ID
 */
app.get('/api/cars/:id', (req, res) => {
    try {
        const data = fs.readFileSync(CARS_FILE, 'utf8');
        const cars = JSON.parse(data);
        const car = cars.find(c => c.id === parseInt(req.params.id));

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json(car);
    } catch (error) {
        console.error('Error reading car:', error);
        res.status(500).json({ error: 'Failed to read car data' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Autocredit Romania - Server Running     ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Admin Panel: http://localhost:${PORT}/admin.html
║   Website: http://localhost:${PORT}/index.html
║   API: http://localhost:${PORT}/api/cars
╚════════════════════════════════════════════╝
    `);
});
