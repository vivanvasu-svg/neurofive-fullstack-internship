import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import coffeeRoutes from './routes/coffeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable compression middleware
app.use(compression());

// Standard middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically with cache headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1y',
    etag: true,
    immutable: true
}));

// API Routes
app.use('/api/coffees', coffeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Brew Haven Backend is running' });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'), {
        maxAge: '1d'
    }));

    app.get('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
}

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
