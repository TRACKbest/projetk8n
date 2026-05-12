const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/usersdb';

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
    mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));

    return conn;
  } catch (err) {
    logger.error('MongoDB connection failed:', err.message);
    throw err;
  }
};

module.exports = connectDB;
