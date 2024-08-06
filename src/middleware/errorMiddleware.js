// src/middleware/errorMiddleware.js
<<<<<<< HEAD
const { AppError } = require('../utils/errors');

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
  });
};

const notFoundMiddleware = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { errorMiddleware, notFoundMiddleware };
=======
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
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
