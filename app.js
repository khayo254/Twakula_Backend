const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');

connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
