require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

let server;

const start = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Fatal startup error', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  shutdown('unhandledRejection');
});

start();
