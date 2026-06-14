const app = require('./app');
const { connectDatabase } = require('./config/database');
const { env } = require('./config/env');
const { logger } = require('./utils/logger');
const mongoose = require('mongoose');

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      logger.info(`Tryer API running on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.connection.close(false);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
