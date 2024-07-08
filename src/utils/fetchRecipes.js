const mongoose = require('mongoose');
const Recipe = require('../models/Recipe'); // Adjust the path based on your project structure

const fetchRecipes = async () => {
  try {
    // Connect to MongoDB (remove deprecated options)
    await mongoose.connect('mongodb://localhost:27017/twakula');

    // Fetch all recipes
    const recipes = await Recipe.find();
    console.log('Recipes:', recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  } finally {
    // Close Mongoose connection
    mongoose.connection.close();
  }
};

fetchRecipes();
