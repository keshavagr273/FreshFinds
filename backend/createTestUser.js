const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'test' });
    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Username:', existingUser.username);
      console.log('Email:', existingUser.email);
      console.log('Customer ID:', existingUser.customerID);
      console.log('Role:', existingUser.role);
      return;
    }

    // Create test user
    const testUser = new User({
      username: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('testpass', 12),
      phone: '1234567890',
      role: 'customer',
      customerID: new User().generateCustomerID(),
      isVerified: true,
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA'
      }
    });

    await testUser.save();

    console.log('✅ Test user created successfully!');
    console.log('Login credentials:');
    console.log('Username: test');
    console.log('Email: test@example.com');
    console.log('Password: testpass');
    console.log('Generated Customer ID:', testUser.customerID);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();