import Order from '../models/Order.js';
import Coffee from '../models/Coffee.js';

/**
 * Seeds mock orders distributed over the last 7 days if the orders collection is empty.
 * This ensures the analytics dashboard has data to plot immediately.
 */
export const seedOrders = async () => {
    try {
        const orderCount = await Order.countDocuments();
        if (orderCount > 0) {
            console.log('[Seed] Orders already exist – skipping seed.');
            return;
        }

        console.log('[Seed] Seeding sample orders for Analytics Dashboard...');

        // Find existing coffees to match name/category properly
        const coffees = await Coffee.find({});
        const coffeeNames = coffees.map(c => c.name);

        // Fallback names if MongoDB hasn't finished seeding coffees yet
        const defaultNames = [
            'Espresso Macchiato',
            'Caramel Macchiato',
            'Cold Brew',
            'Irish Coffee Special',
            'Mocha Latte'
        ];

        const targetCoffees = coffeeNames.length > 0 ? coffeeNames : defaultNames;

        const users = ['john_doe', 'alice_smith', 'coffeelover', 'emma_jones', 'david_miller'];
        const statuses = ['completed', 'completed', 'completed', 'pending']; // 75% completed

        // Generate orders spread across the last 7 days
        const orders = [];
        for (let i = 0; i < 20; i++) {
            const coffeeName = targetCoffees[Math.floor(Math.random() * targetCoffees.length)];
            const username = users[Math.floor(Math.random() * users.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const pricePerUnit = 4.5 + Math.random() * 3; // $4.50 - $7.50
            const totalPrice = pricePerUnit * quantity;
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Spread dates over the last 7 days
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 7));
            // Add slight hour variance
            createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 12));

            orders.push({
                username,
                coffeeName,
                quantity,
                totalPrice,
                status,
                createdAt,
                updatedAt: createdAt
            });
        }

        await Order.insertMany(orders);
        console.log(`[Seed] Seeded ${orders.length} mock orders successfully.`);
    } catch (err) {
        console.error('[Seed] Failed to seed orders:', err.message);
    }
};
