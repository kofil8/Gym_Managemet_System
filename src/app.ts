import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/logger'; // Import the logger
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup morgan to log requests to the console using winston
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()), // Log the message using winston
    },
  })
);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected'); // Use logger instead of console.log
  } catch (err) {
    logger.error('MongoDB connection error:', err); // Use logger for error
  }
})();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Use logger instead of console.log
});

app.use(errorHandler);
