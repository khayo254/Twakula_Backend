const Recipe = require('../models/Recipe');
const { AppError, ValidationError } = require('../utils/errors');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to the file name
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Joi schema for validation
const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(Joi.string()).required(),
  authorId: Joi.string().required()
});

const addNewRecipe = async (req, res, next) => {
  console.log('POST /add_new_recipe');

  // Extract images
  const imageUrls = req.files.map(file => file.path);
  console.log('Image URLs:', imageUrls);

  try {
    // Ensure authorId is set from req.user
    const authorId = req.user ? req.user.id : null;
    if (!authorId) {
      return next(new ValidationError('Author ID is required'));
    }

    // Validate request body
    const { error, value } = recipeSchema.validate({ ...req.body, authorId });
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    // Create new recipe
    const newRecipe = new Recipe({
      title: value.title,
      description: value.description,
      ingredients: value.ingredients,
      steps: value.steps,
      images: imageUrls,
      authorId: value.authorId
    });

    console.log('New Recipe:', newRecipe);

    // Save recipe to the database
    const savedRecipe = await newRecipe.save();
    console.log('Saved Recipe:', savedRecipe);

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error.message); // Log the actual error message
    next(new AppError('Error saving recipe', 500));
  }
};

// Function to fetch recipes for explore page
const exploreRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const recipesWithImages = recipes.map(recipe => ({
      ...recipe.toObject(),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${recipe.images[0]}` // Adjust path as necessary
    }));

    res.json(recipesWithImages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

// Function to rate a recipe
const rateRecipe = async (req, res, next) => {
  console.log('POST /:id/rate');
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
};

// Function to upload an image for a recipe
const uploadImage = async (req, res, next) => {
  console.log('POST /:id/upload-image');
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
};

// Function to get all recipes
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    next(new AppError('Error fetching recipes', 500));
  }
};

// Function to get a recipe by ID
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }
    res.status(200).json(recipe);
  } catch (error) {
    next(new AppError('Error fetching recipe', 500));
  }
};

// Function to get trending recipes
const getTrendingRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(recipes);
  } catch (error) {
    next(new AppError('Error fetching trending recipes', 500));
  }
};

module.exports = {
  addNewRecipe,
  exploreRecipes,
  rateRecipe,
  uploadImage,
  getAllRecipes,
  getRecipeById,
  getTrendingRecipes
};
