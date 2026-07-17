import express from 'express';
import cors from 'cors';
import coffeeRoutes from './routes/coffeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/coffees', coffeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Brew Haven Backend is running' });
});

// Catch-all route for unknown API endpoints
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found. Please verify the URL and try again.' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER_ERROR:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred. Please try again.',
    });
});

export default app;
