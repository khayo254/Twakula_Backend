const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.user = decoded; // Assuming the decoded token contains user details
=======
    req.user = decoded; // Assuming decoded token contains user details
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

module.exports = verifyToken;
