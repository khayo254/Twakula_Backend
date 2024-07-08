const mongoose = require('mongoose');
const User = require('../models/User');

async function fetchUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/twakula', {
      // Options are no longer needed
    });

    // Fetch all users
    const users = await User.find();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    // Close Mongoose connection
    mongoose.connection.close();
  }
}

// Call the function to fetch users
fetchUsers();
