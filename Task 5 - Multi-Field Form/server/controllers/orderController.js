import Order from '../models/Order.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res) => {
    try {
        const { coffeeName, quantity, totalPrice } = req.body;
        const username = req.user.username;

        if (!coffeeName || !quantity || totalPrice === undefined) {
            return res.status(400).json({ message: 'All order fields (coffeeName, quantity, totalPrice) are required' });
        }

        const order = new Order({
            username,
            coffeeName,
            quantity,
            totalPrice,
            status: 'pending',
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin Only)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status || !['pending', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Valid status (pending, completed) is required' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};
