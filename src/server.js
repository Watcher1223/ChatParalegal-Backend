const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Import routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const incorporationRoutes = require('./routes/incorporation');
const einRoutes = require('./routes/ein');
const bankRoutes = require('./routes/bank');
const webhookRoutes = require('./routes/webhooks');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-frontend-domain.com', // Replace with your frontend domain
        'https://yourdomain.com',
        'http://localhost:3000',
        'http://localhost:3001'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check routes
app.use('/health', healthRoutes);

// Legacy health check endpoint (for compatibility)
app.get('/health-legacy', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    mode: process.env.DB_HOST ? 'database' : 'mock'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/incorporation', incorporationRoutes);
app.use('/api/v1/ein', einRoutes);
app.use('/api/v1/bank', bankRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ChatParalegal Backend API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV,
    mode: process.env.DB_HOST ? 'database' : 'mock',
    endpoints: {
      health: '/health',
      health_detailed: '/health/detailed',
      api: '/api/v1',
      docs: '/api-docs'
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
  
  if (process.env.DB_HOST) {
    logger.info(`🗄️ Database mode enabled`);
  } else {
    logger.info(`🔧 Mock mode enabled - all endpoints return realistic test data`);
  }
  
  logger.info(`🌐 CORS enabled for frontend integration`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app; 