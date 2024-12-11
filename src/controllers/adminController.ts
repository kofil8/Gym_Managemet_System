import bcrypt from 'bcryptjs';
import User from '../models/User';
import Schedule from '../models/Schedule';
import Class from '../models/Class';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Create a new trainer
 * @param {Object} req - Request containing the trainer data
 * @param {Object} res - Response that will be sent back to the client
 * @returns {Object} Response containing the result of the operation
 */
export const createTrainer = async (req: Request, res: Response) => {
  // Validate input
  await body('name').notEmpty().withMessage('Name is required').run(req);
  await body('email').isEmail().withMessage('Valid email is required').run(req);
  await body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .run(req);
  await body('role')
    .equals('Trainer')
    .withMessage('Role must be Trainer')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password: plainPassword, role } = req.body;

  const password = await bcrypt.hash(plainPassword, 10);
  const trainer = new User({ name, email, password, role });

  try {
    await trainer.save();
    res
      .status(201)
      .json({ success: true, message: 'Trainer created successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create trainer',
      error: error.message,
    });
  }
};

/**
 * Create a new schedule
 * @param {Object} req - Request containing the schedule data
 * @param {Object} res - Response that will be sent back to the client
 * @returns {Object} Response containing the result of the operation
 */
export const createSchedule = async (req: Request, res: Response) => {
  // Validate input
  await body('date').notEmpty().withMessage('Date is required').run(req);
  await body('classId').notEmpty().withMessage('Class ID is required').run(req);
  await body('trainerId')
    .notEmpty()
    .withMessage('Trainer ID is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { date, classId, trainerId } = req.body;

  const existingSchedules = await Schedule.find({ date, trainerId });

  if (existingSchedules.length >= 5) {
    return res
      .status(400)
      .json({ success: false, message: 'Maximum 5 schedules allowed per day' });
  }

  const schedule = new Schedule({ date, classId, trainerId });

  try {
    await schedule.save();
    res
      .status(201)
      .json({ success: true, message: 'Schedule created successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message,
    });
  }
};

/**
 * List all trainers
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response containing the list of trainers
 */
export const listTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await User.find({ role: 'Trainer' });
    res.status(200).json({ success: true, trainers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trainers',
      error: error.message,
    });
  }
};
