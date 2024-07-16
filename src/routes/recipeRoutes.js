const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// POST /api/recipes/add_new_recipe - Create a new recipe
router.post('/add_new_recipe', async (req, res) => {
  // Extract data from request body
  const { title, description, ingredients, steps, images, authorId } = req.body;

  try {
    // Create new recipe instance
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      images,
      authorId
    });

    // Save recipe to database
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes - Retrieve all recipes
router.get('/recipes', async (req, res) => {
  try {
    // Fetch all recipes from the database
    const recipes = await Recipe.find();
    res.json(recipes); // Return all recipes as JSON
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/:id - Retrieve a specific recipe by ID
router.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Find recipe by ID in the database
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe); // Return the recipe as JSON
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
