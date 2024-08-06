const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middleware/authMiddleware');
const { upload } = require('../config/multerConfig');


// Route for adding a new recipe with image uploads
<<<<<<< HEAD
router.post('/add_new_recipe', verifyToken, upload.array('images', 5), recipeController.addNewRecipe);
=======
router.post('/add_new_recipe', upload.array('images', 5), recipeController.addNewRecipe);
>>>>>>> 0ecca78133a30955eaae48fc52acde2156397f4e

// Route for fetching recipes to explore
router.get('/explore', recipeController.exploreRecipes);

// Route for rating a recipe
router.post('/:id/rate', verifyToken, recipeController.rateRecipe);

// Route for uploading a single image for a recipe
router.post('/:id/upload-image', upload.single('image'), recipeController.uploadImage);

// Route for fetching all recipes
router.get('/', recipeController.getAllRecipes);

// Route for fetching a single recipe by ID
router.get('/:id', recipeController.getRecipeById);

router.get('/trending', recipeController.getTrendingRecipes);

module.exports = router;
