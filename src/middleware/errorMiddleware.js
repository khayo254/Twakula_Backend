// src/middleware/errorMiddleware.js
const AppError = require('../utils/errors');

const notFoundMiddleware = (req, res, next) => {
  console.log(`Route not found: ${req.originalUrl}`);
  const err = new AppError('Not Found', 404);
  next(err);
};

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    statusCode,
  });
};

module.exports = {
  notFoundMiddleware,
  errorMiddleware
};
