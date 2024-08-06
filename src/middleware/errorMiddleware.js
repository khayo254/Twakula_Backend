// src/middleware/errorMiddleware.js
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
