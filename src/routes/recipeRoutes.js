const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const fetchRecipes = require('../utils/fetchRecipes');
const verifyToken = require('../middleware/authMiddleware');
const { upload, optimizeImage } = require('../config/multerConfig');
const { AppError, ValidationError } = require('../utils/errors');
const Joi = require('joi');

// Joi schema for validation
const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.string().required(),
  steps: Joi.string().required(),
  authorId: Joi.string().required()
});

router.post('/add_new_recipe', upload.array('images', 5), async (req, res, next) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  const { title, description, ingredients, steps, authorId } = req.body;
  try {
    const imageUrls = req.files.map(file => file.path);

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(','),
      steps: steps.split(','),
      images: imageUrls,
      authorId
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    next(new AppError('Error saving recipe', 500));
  }
});

router.post('/:id/rate', verifyToken, async (req, res, next) => {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(5).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }

    const userId = req.user ? req.user.id : null;

    const newRating = {
      userId,
      rating,
      comment,
      createdAt: new Date()
    };

    recipe.ratings.push(newRating);

    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = sumRatings / totalRatings;

    await recipe.save();

    res.status(201).json({ message: 'Rating added successfully', recipe });
  } catch (error) {
    next(new AppError('Error adding rating', 500));
  }
});

router.post('/:id/upload-image', upload.single('image'), async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const imageUrl = req.file.path;

    const recipe = await Recipe.findByIdAndUpdate(recipeId, { $push: { images: imageUrl } }, { new: true });

    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }

    res.json({ message: 'Image uploaded successfully', recipe });
  } catch (error) {
    next(new AppError('Error uploading image', 500));
  }
});

router.get('/', fetchRecipes.getAllRecipes);

router.get('/:id', fetchRecipes.getRecipeById);

module.exports = router;
