import express from 'express';
import {
    getCoffees,
    getCoffeeById,
    createCoffee,
    updateCoffee,
    deleteCoffee,
} from '../controllers/coffeeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getCoffees)
    .post(protect, createCoffee);

router.route('/:id')
    .get(getCoffeeById)
    .put(protect, updateCoffee)
    .delete(protect, deleteCoffee);

export default router;

