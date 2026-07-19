import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Coffee from '../models/Coffee.js';

const MONGO_URI = 'mongodb://localhost:27017/brew-haven-test';

describe('Brew Haven Backend API Tests', () => {
    let adminToken;
    let customerToken;
    let testCoffeeId;

    beforeAll(async () => {
        // Connect to test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }
    });

    afterAll(async () => {
        // Drop test database and disconnect Mongoose
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections to ensure clean state
        await User.deleteMany({});
        await Coffee.deleteMany({});

        // Create standard test admin user and customer user
        const adminUser = await User.create({
            username: 'test_admin',
            password: 'password123',
            role: 'admin'
        });

        const customerUser = await User.create({
            username: 'test_customer',
            password: 'password123',
            role: 'customer'
        });

        // Helper to sign JWT tokens
        const jwt = (await import('jsonwebtoken')).default;
        const secret = process.env.JWT_SECRET || 'fallback_secret_key';

        adminToken = jwt.sign(
            { id: adminUser.id, username: adminUser.username, role: adminUser.role },
            secret,
            { expiresIn: '1h' }
        );

        customerToken = jwt.sign(
            { id: customerUser.id, username: customerUser.username, role: customerUser.role },
            secret,
            { expiresIn: '1h' }
        );

        // Preseed one coffee item
        const seededCoffee = await Coffee.create({
            name: 'Original Espresso',
            description: 'Rich dark espresso shot',
            price: 3.50,
            category: 'Espresso',
            image: '/uploads/default.png'
        });
        testCoffeeId = seededCoffee.id;
    });

    // --- Auth Tests ---
    describe('Authentication Routes (/api/auth)', () => {
        it('should successfully register a new customer', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'new_intern',
                    password: 'securePassword1'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.username).toBe('new_intern');
            expect(res.body.role).toBe('customer');
        });

        it('should fail registration if password is too short', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'shorty',
                    password: '123'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Password must be at least 6 characters');
        });

        it('should successfully log in with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'test_customer',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.username).toBe('test_customer');
        });

        it('should fail login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'test_customer',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Invalid username or password');
        });
    });

    // --- CRUD Coffee Tests ---
    describe('Coffee Offerings Routes (/api/coffees)', () => {
        it('should allow anyone to fetch coffee list', async () => {
            const res = await request(app)
                .get('/api/coffees');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Original Espresso');
        });

        it('should deny coffee creation to anonymous users', async () => {
            const res = await request(app)
                .post('/api/coffees')
                .send({
                    name: 'Mocha Latte',
                    price: 4.50,
                    category: 'Latte',
                    description: 'Espresso with rich chocolate syrup'
                });

            expect(res.status).toBe(401); // Unauthorized
        });

        it('should deny coffee creation to non-admin (customer) users', async () => {
            const res = await request(app)
                .post('/api/coffees')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    name: 'Mocha Latte',
                    price: 4.50,
                    category: 'Latte',
                    description: 'Espresso with rich chocolate syrup',
                    image: '/uploads/mocha.png'
                });

            expect(res.status).toBe(403); // Forbidden
        });

        it('should allow admin to create a new coffee item', async () => {
            const res = await request(app)
                .post('/api/coffees')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Mocha Latte',
                    price: 4.50,
                    category: 'Latte',
                    description: 'Espresso with rich chocolate syrup',
                    image: '/uploads/mocha.png'
                });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Mocha Latte');
            expect(res.body.price).toBe(4.50);
        });

        it('should allow admin to update an existing coffee item', async () => {
            const res = await request(app)
                .put(`/api/coffees/${testCoffeeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Original Espresso Decaf',
                    price: 3.75,
                    category: 'Espresso',
                    description: 'Decaf dark espresso shot',
                    image: '/uploads/default.png'
                });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Original Espresso Decaf');
            expect(res.body.price).toBe(3.75);
        });

        it('should allow admin to delete coffee item', async () => {
            const res = await request(app)
                .delete(`/api/coffees/${testCoffeeId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('removed successfully');
        });
    });
});
