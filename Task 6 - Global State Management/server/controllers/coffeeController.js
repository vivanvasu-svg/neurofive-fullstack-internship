import mongoose from 'mongoose';
import Coffee from '../models/Coffee.js';

// @desc    Get all coffees
// @route   GET /api/coffees
// @access  Public
export const getCoffees = async (req, res) => {
    try {
        const coffees = await Coffee.find({}).sort({ createdAt: -1 });
        res.status(200).json(coffees);
    } catch (error) {
        res.status(500).json({ message: 'Unable to connect to the server. Please try again.', error: error.message });
    }
};

// @desc    Get single coffee by ID
// @route   GET /api/coffees/:id
// @access  Public
export const getCoffeeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Coffee ID format.' });
        }

        const coffee = await Coffee.findById(id);
        if (!coffee) {
            return res.status(404).json({ message: 'Coffee item not found.' });
        }

        res.status(200).json(coffee);
    } catch (error) {
        res.status(500).json({ message: 'Unable to connect to the server. Please try again.', error: error.message });
    }
};

// @desc    Create coffee
// @route   POST /api/coffees
// @access  Public
export const createCoffee = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        // Field validation
        if (!name || !description || price === undefined || !category || !image) {
            return res.status(400).json({ message: 'Please provide all required fields: name, description, price, category, image' });
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: 'Price must be a valid non-negative number' });
        }

        const coffee = new Coffee({
            name,
            description,
            price: Number(price),
            category,
            image,
        });

        const savedCoffee = await coffee.save();
        res.status(201).json(savedCoffee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Unable to connect to the server. Please try again.', error: error.message });
    }
};

// @desc    Update coffee
// @route   PUT /api/coffees/:id
// @access  Public
export const updateCoffee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Coffee ID format.' });
        }

        // Field validation
        if (!name || !description || price === undefined || !category || !image) {
            return res.status(400).json({ message: 'Please provide all required fields: name, description, price, category, image' });
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: 'Price must be a valid non-negative number' });
        }

        const coffee = await Coffee.findById(id);
        if (!coffee) {
            return res.status(404).json({ message: 'Coffee item not found.' });
        }

        coffee.name = name;
        coffee.description = description;
        coffee.price = Number(price);
        coffee.category = category;
        coffee.image = image;

        const updatedCoffee = await coffee.save();
        res.status(200).json(updatedCoffee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Unable to connect to the server. Please try again.', error: error.message });
    }
};

// @desc    Delete coffee
// @route   DELETE /api/coffees/:id
// @access  Public
export const deleteCoffee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Coffee ID format.' });
        }

        const coffee = await Coffee.findById(id);
        if (!coffee) {
            return res.status(404).json({ message: 'Coffee item not found.' });
        }

        await coffee.deleteOne();
        res.status(200).json({ message: 'Coffee item removed successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Unable to connect to the server. Please try again.', error: error.message });
    }
};
