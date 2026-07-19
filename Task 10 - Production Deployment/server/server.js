import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedAdmin } from './utils/seedAdmin.js';
import { seedOrders } from './utils/seedOrders.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB database and seed admin account & orders
connectDB().then(async () => {
    await seedAdmin();
    await seedOrders();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

