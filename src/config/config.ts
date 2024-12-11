import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const config: Config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
