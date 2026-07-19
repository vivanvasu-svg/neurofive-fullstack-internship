import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        quote: {
            type: String,
            required: [true, 'Review content is required'],
            minlength: [5, 'Review must be at least 5 characters long'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
            default: 5,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
