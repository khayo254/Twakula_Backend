const { AppError } = require('../utils/errors');

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('Error:', err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

const notFoundMiddleware = (req, res, next) => {
  const err = new AppError('Not Found', 404);
  next(err);
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware
};
