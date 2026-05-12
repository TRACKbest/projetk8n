const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors;

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // Invalid Mongo ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  if (status >= 500) logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err}`);

  res.status(status).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
