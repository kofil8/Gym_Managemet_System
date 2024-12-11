/**
 * Centralized error handler to standardize error responses
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next handler in the middleware chain
 */
export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    stack,
  });
};
