const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');
const { errorMiddleware, notFoundMiddleware } = require('./src/middleware/errorMiddleware');
const cors = require('cors');
const path = require('path'); // Import path module
const { AppError, ValidationError } = require('./src/utils/errors'); // Correctly import AppError and ValidationError

// Connect to the database
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Handle 404 error
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
