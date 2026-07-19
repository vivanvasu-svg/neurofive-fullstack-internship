import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        coffeeName: {
            type: String,
            required: [true, 'Coffee name is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price cannot be negative'],
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
