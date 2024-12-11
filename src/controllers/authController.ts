import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

export const register = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorDetails = errors.array().map(({ msg }) => ({ message: msg }));

      return res.status(400).json({
        success: false,
        message: 'Validation error occurred.',
        errorDetails,
      });
    }

    const { name, email, password: plainPassword, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Validation error occurred.',
          errorDetails: {
            field: 'email',
            message: 'Email is already in use.',
          },
        });
      }

      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'User  registered successfully',
        data: user, // Return the created user data
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({
        success: false,
        message: 'User  registration failed',
      });
    }
  },
];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
        errorDetails: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
        errorDetails: 'Invalid email or password.',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};
