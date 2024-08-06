const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Assuming the decoded token contains user details
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

module.exports = verifyToken;
