require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Initialize app
const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Compression for production
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.set('trust proxy', 1);
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection with retry logic
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined');
  process.exit(1);
}

const connectWithRetry = () => {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 45000,
    })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gadget Swap API',
      version: '1.0.0',
      description: 'API for gadget e-commerce with installments and trade-ins',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
      { url: 'https://quick-gadget-pcyz28row-alpha-loops-projects.vercel.app', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation at http://localhost:${PORT}/api-docs`);
});