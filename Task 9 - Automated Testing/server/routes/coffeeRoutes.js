import express from 'express';
import {
    getCoffees,
    getCoffeeById,
    createCoffee,
    updateCoffee,
    deleteCoffee,
} from '../controllers/coffeeController.js';
import protect, { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getCoffees)
    .post(protect, adminOnly, createCoffee);

router.route('/:id')
    .get(getCoffeeById)
    .put(protect, adminOnly, updateCoffee)
    .delete(protect, adminOnly, deleteCoffee);

export default router;

