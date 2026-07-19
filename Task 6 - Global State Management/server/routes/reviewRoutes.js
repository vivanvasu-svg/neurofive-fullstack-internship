import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews - public
router.get('/', getReviews);

// POST /api/reviews - authenticated customers
router.post('/', protect, createReview);

export default router;
