import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to automatically attach authorization Bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    if (response.data && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', response.data.username);
        localStorage.setItem('admin_role', response.data.role || 'customer');
    }
    return response.data;
};

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', response.data.username);
        localStorage.setItem('admin_role', response.data.role || 'customer');
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('admin_token');
};

export const isAdmin = () => {
    return localStorage.getItem('admin_role') === 'admin';
};

export const getReviews = async () => {
    const response = await api.get('/reviews');
    return response.data;
};

export const createReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
};

export const getCoffees = async () => {
    const response = await api.get('/coffees');
    return response.data;
};

export const getCoffeeById = async (id) => {
    const response = await api.get(`/coffees/${id}`);
    return response.data;
};

export const createCoffee = async (coffeeData) => {
    const response = await api.post('/coffees', coffeeData);
    return response.data;
};

export const updateCoffee = async (id, coffeeData) => {
    const response = await api.put(`/coffees/${id}`, coffeeData);
    return response.data;
};

export const deleteCoffee = async (id) => {
    const response = await api.delete(`/coffees/${id}`);
    return response.data;
};

export default {
    register,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getReviews,
    createReview,
    getOrders,
    createOrder,
    updateOrderStatus,
    getCoffees,
    getCoffeeById,
    createCoffee,
    updateCoffee,
    deleteCoffee,
};
