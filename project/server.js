require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Initialize app
const app = express();
// server.js


app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests
//     message: 'Too many requests from this IP, please try again later'
//   })
// );

// if (process.env.NODE_ENV === 'production') {
//   app.use(compression()); // Enable gzip compression
//   app.use(helmet()); // Security headers
//   app.set('trust proxy', 1); // For rate limiter behind proxies
// }

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gadget Swap API',
      version: '1.0.0',
      description: 'API for gadget e-commerce with installments and trade-ins',
      contact: {
        name: 'API Support',
        email: 'support@gadgetswap.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.gadgetswap.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            name: { 
              type: 'string',
              example: 'iPhone 13 Pro' 
            },
            description: { 
              type: 'string',
              example: 'Latest Apple smartphone with A15 Bionic chip' 
            },
            price: { 
              type: 'number',
              example: 999.99 
            },
            condition: { 
              type: 'string', 
              enum: ['new', 'used', 'refurbished'],
              default: 'new'
            },
            category: { 
              type: 'string', 
              enum: ['phone', 'tablet', 'laptop', 'accessory'] 
            }
          }
        },
        Order: {
          type: 'object',
          required: ['product', 'user'],
          properties: {
            product: { 
              type: 'string',
              description: 'ID of the product being ordered' 
            },
            user: { 
              type: 'string',
              description: 'ID of the user placing the order' 
            },
            installments: {
              type: 'object',
              properties: {
                months: { 
                  type: 'number',
                  example: 12 
                },
                monthlyPayment: { 
                  type: 'number',
                  example: 83.33 
                }
              }
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered'],
              default: 'pending'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to your route files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Swagger UI Middleware - Must come before your routes
app.use(
  '/api-docs', 
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Gadget Swap API Documentation",
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/assets/favicon.ico'
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});