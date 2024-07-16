const { body, validationResult } = require('express-validator');

// Validation middleware for creating a new recipe
const validateRecipe = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').isArray({ min: 1 }).withMessage('description must be provided as an array'),
  body('ingredients').isArray({ min: 1 }).withMessage('Ingredients must be provided as an array with at least one item'),
  body('steps').isArray({ min: 1 }).withMessage('Steps must be provided as an array with at least one item'),
  // You can add more validation rules as per your schema requirements

  // Custom sanitizer for array fields to remove empty values
  (req, res, next) => {
    req.body.ingredients = req.body.ingredients.filter(Boolean); // Filter out empty values
    req.body.steps = req.body.steps.filter(Boolean); // Filter out empty values
    next();
  },

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRecipe
};
