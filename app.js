const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');
const { errorMiddleware, notFoundMiddleware } = require('./src/middleware/errorMiddleware');
const { AppError } = require('./src/utils/errors');

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Handle 404 - Not Found
app.use(notFoundMiddleware);

// Global error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

