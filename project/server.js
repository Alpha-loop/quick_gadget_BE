const express = require('express');
const connectDB = require('./db/connect');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');
// const paymentRoutes = require('./routes/payments');
const swapRoutes = require('./routes/swaps');
const inventoryRoutes = require('./routes/inventory');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/inventory', inventoryRoutes);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;