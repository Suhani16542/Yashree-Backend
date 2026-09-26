import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

async function startServer() {
  logger.info('Starting Yashree Backend server...');

  // Attempt database connection
  const isConnected = await connectDB();
  if (!isConnected) {
    logger.error('MongoDB connection failed.');
    process.exit(1);
  }

  server.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`📍 Base API URL: http://localhost:${env.PORT}/api/v1`);
    logger.info(`🩺 Health Check: http://localhost:${env.PORT}/api/v1/health`);
  });

  // Handle graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await disconnectDB();
      } catch (err) {
        logger.error('Error during database disconnect:', err);
      }
      process.exit(0);
    });

    // Force close if graceful shutdown exceeds 10s
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((error) => {
  logger.error('Fatal error starting server:', error);
  process.exit(1);
});
