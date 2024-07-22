const { recipeSchema, ratingSchema } = require('../validations/recipeValidation');

const validateRecipe = (req, res, next) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateRating = (req, res, next) => {
  const { error } = ratingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateRecipe, validateRating };
