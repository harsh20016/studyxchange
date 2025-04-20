const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://studyxchange-backend.onrender.com/api';

class AuthService {
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                return data;
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    }

    static async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/auth/current`, {
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                localStorage.removeItem('token');
                return null;
            }
        } catch (error) {
            localStorage.removeItem('token');
            return null;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

// Export the AuthService class
window.AuthService = AuthService;

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            switch(data.user.role) {
                case 'buyer':
                    window.location.href = 'buyer-dashboard.html';
                    break;
                case 'seller':
                    window.location.href = 'seller-dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                default:
                    window.location.href = '../index.html';
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Check Authentication Status
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Add event listeners if elements exist
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}); 