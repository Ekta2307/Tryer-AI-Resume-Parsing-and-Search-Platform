const multer = require('multer');
const { env } = require('../config/env');
const { logger } = require('../utils/logger');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = error.code === 'LIMIT_FILE_SIZE'
      ? `Each resume must be smaller than ${env.uploadLimitMb}MB`
      : error.message;
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'This resume already exists';
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: env.nodeEnv === 'production' ? undefined : error.stack,
  });
};

module.exports = { errorHandler, notFoundHandler };
