import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Admin from '../pages/Admin';
import { AuthProvider } from '../context/AuthContext';
import { CoffeeProvider } from '../context/CoffeeContext';
import api from '../services/api';

// Mock ImageUpload to simple input for E2E
vi.mock('../components/ImageUpload', () => {
    return {
        default: ({ value, onChange }) => (
            <input
                data-testid="image-upload-mock"
                placeholder="Image URL"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    };
});

// Mock the API service functions
vi.mock('../services/api', () => {
    const isAuthenticated = vi.fn(() => true);
    const isAdmin = vi.fn(() => true);
    const getOrders = vi.fn(async () => []);

    // Maintain mock menu reference inside the closure
    const mockCoffees = [
        {
            id: 'c1',
            name: 'Ethiopian Sidamo',
            category: 'Specialty Brew',
            description: 'Floral and citrus options',
            price: 6.25,
            image: '/uploads/ethiopian.png'
        }
    ];

    const getCoffees = vi.fn(async () => mockCoffees);
    const createCoffee = vi.fn(async (coffeeData) => {
        const newCoffee = {
            id: 'c2',
            name: coffeeData.name,
            price: Number(coffeeData.price),
            category: coffeeData.category,
            description: coffeeData.description,
            image: coffeeData.image || '/uploads/default.png'
        };
        return newCoffee;
    });

    const updateCoffee = vi.fn();
    const deleteCoffee = vi.fn();
    const updateOrderStatus = vi.fn();
    const logout = vi.fn();

    return {
        isAuthenticated,
        isAdmin,
        getOrders,
        getCoffees,
        createCoffee,
        updateCoffee,
        deleteCoffee,
        updateOrderStatus,
        logout,
        default: {
            isAuthenticated,
            isAdmin,
            getOrders,
            getCoffees,
            createCoffee,
            updateCoffee,
            deleteCoffee,
            updateOrderStatus,
            logout
        }
    };
});

describe('Brew Haven End-To-End User Flow Simulation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('admin_token', 'mock_jwt_token');
        localStorage.setItem('admin_user', 'admin');
        localStorage.setItem('admin_role', 'admin');
    });

    it('successfully renders Admin control panel and creates a new coffee item', async () => {
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AuthProvider>
                    <CoffeeProvider>
                        <Admin />
                    </CoffeeProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        // Check page title to confirm Admin Panel loaded
        expect(screen.getByText('Admin Management Dashboard')).toBeInTheDocument();

        // 1. Verify initially seeded item exists in the listing
        await waitFor(() => {
            expect(screen.getByText('Active Menu Items (1)')).toBeInTheDocument();
        });
        expect(screen.getByText('Ethiopian Sidamo')).toBeInTheDocument();

        // 2. Fill out the CoffeeForm
        const nameInput = screen.getByLabelText(/coffee name/i);
        const priceInput = screen.getByLabelText(/price/i);
        const categoryInput = screen.getByLabelText(/category/i);
        const descInput = screen.getByLabelText(/description/i);
        const imageInput = screen.getByTestId('image-upload-mock');

        fireEvent.change(nameInput, { target: { value: 'Brewed Cold Brew' } });
        fireEvent.change(priceInput, { target: { value: '4.95' } });
        fireEvent.change(categoryInput, { target: { value: 'Cold Coffee' } });
        fireEvent.change(descInput, { target: { value: 'Long steeped smooth iced coffee' } });
        fireEvent.change(imageInput, { target: { value: '/uploads/cold-brew.png' } });

        // Submit form using standard button
        const submitBtn = screen.getByRole('button', { name: /add coffee/i });
        fireEvent.click(submitBtn);

        // 3. Verify it calls the API createCoffee and updates the context list
        await waitFor(() => {
            expect(api.createCoffee).toHaveBeenCalled();
        });

        const fs = await import('fs');
        fs.writeFileSync('/home/vivan/internship nf/brew-haven/client/src/tests/debug.log', JSON.stringify({
            calls: api.createCoffee.mock.calls,
            mockCoffeesLength: (await api.getCoffees()).length
        }, null, 2));

        // Verify the new coffee item card is rendered
        await waitFor(() => {
            expect(screen.getByText('Active Menu Items (2)')).toBeInTheDocument();
        });
        expect(screen.getByText('Brewed Cold Brew')).toBeInTheDocument();
        expect(screen.getByText('$4.95')).toBeInTheDocument();
    });
});
