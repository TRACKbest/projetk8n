const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (needed behind Nginx / Ingress)
app.set('trust proxy', 1);

// Security & performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// HTTP logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Health probes (used by K8s liveness/readiness)
app.get('/health', (_req, res) => res.json({ status: 'OK', uptime: process.uptime() }));
app.get('/ready', (_req, res) => res.json({ status: 'ready' }));

// API routes
app.use('/api/users', userRoutes);

// Root
app.get('/', (_req, res) => res.json({
  name: 'User Management API',
  version: '1.0.0',
  endpoints: ['/api/users', '/health', '/ready'],
}));

// 404 & centralized error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
