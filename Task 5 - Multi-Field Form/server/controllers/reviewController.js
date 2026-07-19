import Review from '../models/Review.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(10);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { quote, rating } = req.body;
        const username = req.user.username;

        if (!quote) {
            return res.status(400).json({ message: 'Review content is required' });
        }

        const review = new Review({
            username,
            quote,
            rating: rating || 5,
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};
