const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function seedAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/twakula');

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('Admin already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    // Create a new admin user
    const newAdmin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Save the admin user to the database
    await newAdmin.save();
    console.log('Admin created successfully.');

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

seedAdmin();
