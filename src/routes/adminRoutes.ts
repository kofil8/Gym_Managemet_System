import express from 'express';
import { createTrainer, createSchedule } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/trainers', authenticate, createTrainer);
router.post('/schedules', authenticate, createSchedule);

export default router;