const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'https://studyxchange.netlify.app'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyxchange', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['buyer', 'seller', 'admin'] },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Listing Schema
const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', listingSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin Dashboard Routes
app.get('/api/admin/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    try {
        const [totalUsers, totalListings, totalOrders, recentUsers, recentListings, recentOrders] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Order.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5),
            Listing.find().sort({ createdAt: -1 }).limit(5).populate('seller', 'name'),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('buyer seller', 'name')
        ]);
        
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        res.json({
            totalUsers,
            totalListings,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentUsers,
            recentListings,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 