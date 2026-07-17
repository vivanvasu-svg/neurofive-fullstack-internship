import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import protect, { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders - authenticated customers
router.post('/', protect, createOrder);

// GET /api/orders - admin only
// PUT /api/orders/:id - admin only
router.use(protect, adminOnly);
router.route('/')
    .get(getOrders);
router.route('/:id')
    .put(updateOrderStatus);

export default router;
