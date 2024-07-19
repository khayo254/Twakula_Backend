const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const fetchRecipes = require('../utils/fetchRecipes');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../config/uploadConfig'); // Assuming Multer and Cloudinary setup in 'config/uploadConfig.js'

// POST /api/recipes/add_new_recipe - Create a new recipe with image upload
router.post('/add_new_recipe', upload.array('images', 5), async (req, res) => {
  const { title, description, ingredients, steps, authorId } = req.body;
  try {
    const imageUrls = req.files.map(file => file.path);

    console.log('Uploaded image URLs:', imageUrls);

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
    console.error('Error saving recipe:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes/:id/rate - Rate a recipe
router.post('/:id/rate', verifyToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 5 }).withMessage('Comment must be at least 5 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const userId = req.user ? req.user.id : null;

    const newRating = {
      userId,
      rating,
      comment,
      createdAt: new Date()
    };

    recipe.ratings.push(newRating);

    // Calculate the new average rating
    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = sumRatings / totalRatings;

    await recipe.save();

    res.status(201).json({ message: 'Rating added successfully', recipe });
  } catch (error) {
    console.error('Error adding rating:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes/:id/upload-image - Upload image for a recipe
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    const recipeId = req.params.id;
    const imageUrl = req.file.path; // Cloudinary URL of the uploaded image

    // Update the recipe with the uploaded image URL
    const recipe = await Recipe.findByIdAndUpdate(recipeId, { $push: { images: imageUrl } }, { new: true });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Image uploaded successfully', recipe });
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes - Retrieve all recipes with pagination and optional filters
router.get('/', fetchRecipes.getAllRecipes);

// GET /api/recipes/:id - Retrieve a specific recipe by ID
router.get('/:id', fetchRecipes.getRecipeById);

module.exports = router;
