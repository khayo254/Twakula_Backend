const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const verifyToken = require('../middleware/authMiddleware');
const Joi = require('joi');
const { deleteUser } = require('../controllers/userController'); // Import deleteUser
const { AppError, ValidationError } = require('../utils/errors'); // Correctly import AppError and ValidationError

const registerSchema = Joi.object({
  username: Joi.string().required(),
=======
const { AppError, ValidationError } = require('../utils/errors');
const verifyToken = require('../middleware/authMiddleware');
const Joi = require('joi');
const { deleteUser } = require('../controllers/userController'); // Import deleteUser

const registerSchema = Joi.object({
  name: Joi.string().required(),
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

<<<<<<< HEAD
=======
// User registration route
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
router.post('/register', async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

<<<<<<< HEAD
  const { username, email, password } = req.body;
=======
  const { name, email, password } = req.body;
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ValidationError('User already exists'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
<<<<<<< HEAD
      username,
=======
      name,
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
<<<<<<< HEAD
      username: user.name,
=======
      name: user.name,
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
      email: user.email,
      token
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('Error registering user:', error); // Log the error for debugging
=======
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
    next(new AppError('Error registering user', 500));
  }
});

// User login route
router.post('/login', async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.json({
        _id: user._id,
<<<<<<< HEAD
        username: user.name,
=======
        name: user.name,
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
        email: user.email,
        token
      });
    } else {
      return next(new ValidationError('Invalid email or password'));
    }
  } catch (error) {
    next(new AppError('Error logging in user', 500));
  }
});

// Suggested users route
router.get('/suggested', verifyToken, async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const suggestedUsers = await User.find({ _id: { $ne: currentUserId } }).limit(10);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    next(new AppError('Error fetching suggested users', 500));
  }
});

// Search users route
router.get('/search', verifyToken, async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(new ValidationError('Search query is required'));
  }

  try {
<<<<<<< HEAD
    const users = await User.find({ username: { $regex: query, $options: 'i' } });
=======
    const users = await User.find({ name: { $regex: query, $options: 'i' } });
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e
    res.status(200).json(users);
  } catch (error) {
    next(new AppError('Error searching users', 500));
  }
});

// Fetch all users route (admin use only)
router.get('/users', verifyToken, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(new AppError('Error fetching users', 500));
  }
});

router.get('/me', verifyToken, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(new AppError('Error fetching user data', 500));
  }
});

router.delete('/:id', verifyToken, deleteUser); // Ensure deleteUser is correctly imported

module.exports = router;
