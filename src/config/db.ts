import mongoose from 'mongoose';
import config from './config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI, {});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
