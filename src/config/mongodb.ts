import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB(): Promise<boolean> {
  if (!env.MONGODB_URI) {
    logger.warn('⚠️  MONGODB_URI is not set. Database operations will fail.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info('✅ MongoDB connected successfully');
    return true;
  } catch (error: any) {
    logger.error('❌ MongoDB connection failed.');
    return false;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected cleanly');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
  }
}
