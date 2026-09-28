import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
