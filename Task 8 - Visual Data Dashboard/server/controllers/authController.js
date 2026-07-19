import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide both username and password' });
        }

        const usernameTrimmed = username.trim();
        if (usernameTrimmed.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Block registration with admin-like usernames
        if (usernameTrimmed.toLowerCase().startsWith('admin')) {
            return res.status(400).json({ message: 'That username is reserved. Please choose a different username.' });
        }

        // Check if user exists
        const userExists = await User.findOne({ username: usernameTrimmed });
        if (userExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create new customer user (password is hashed in pre-save middleware)
        const user = await User.create({
            username: usernameTrimmed,
            password,
            role: 'customer',
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Register controller error:', error.message);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide both username and password' });
        }

        const usernameTrimmed = username.trim();

        // Find user by username
        const user = await User.findOne({ username: usernameTrimmed });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check matching password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Login controller error:', error.message);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
};

