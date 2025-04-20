import config from './config.js';

const API_URL = config.API_URL;

// Authentication
const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Products
const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
};

const createProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    });
    return response.json();
};

// Cart
const getCart = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product: productId, quantity })
    });
    return response.json();
};

// Messages
const getMessages = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

const sendMessage = async (receiverId, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver: receiverId, content })
    });
    return response.json();
};

const api = {
    login,
    register,
    getProducts,
    createProduct,
    getCart,
    addToCart,
    getMessages,
    sendMessage
};

export default api; 