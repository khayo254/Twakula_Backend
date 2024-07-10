const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path to User model

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const createUserAndGenerateToken = async (userData) => {
  const user = new User(userData);
  await user.save();
  const token = generateToken(user);
  return { user, token };
};

module.exports = { generateToken, createUserAndGenerateToken };
