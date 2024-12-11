import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';

// Middleware for JWT authentication
const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export { authenticateJWT };
