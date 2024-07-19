const Recipe = require('../models/Recipe');

// Retrieve all recipes with pagination and optional filters
exports.getAllRecipes = async (req, res) => {
  const { page = 1, limit = 10, title, authorId } = req.query;
  const skip = (page - 1) * limit;

  try {
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    if (authorId) {
      query.authorId = authorId;
    }

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt for consistent pagination
      .skip(skip)
      .limit(parseInt(limit));

    const totalRecipes = await Recipe.countDocuments(query);

    // Calculate average ratings
    const recipesWithRatings = recipes.map(recipe => {
      const averageRating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / (recipe.ratings.length || 1);
      return { ...recipe.toObject(), averageRating };
    });

    res.json({
      recipes: recipesWithRatings,
      totalPages: Math.ceil(totalRecipes / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Retrieve a specific recipe by ID
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const averageRating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / (recipe.ratings.length || 1);

    res.json({ ...recipe.toObject(), averageRating });
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
