const mongoose = require('mongoose');
const { env } = require('./env');
const { logger } = require('../utils/logger');
const Resume = require('../models/Resume');

const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    autoIndex: env.nodeEnv !== 'production',
  });

  logger.info(`MongoDB connected: ${connection.connection.host}`);
  await Resume.init();
  logger.info('MongoDB indexes ready');
  return connection;
};

mongoose.connection.on('error', (error) => {
  logger.error(`MongoDB error: ${error.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

module.exports = { connectDatabase };
