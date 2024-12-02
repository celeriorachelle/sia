const mongoose = require('mongoose');
const User = require('../../models/user'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Function to drop email index
async function dropEmailIndex() {
  try {
    // Check for the email index on the User model
    const indexes = await User.collection.indexes();
    const emailIndex = indexes.find(index => index.key.hasOwnProperty('email'));

    if (emailIndex) {
      console.log('Dropping existing email index...');
      await User.collection.dropIndex('email_1');
      console.log('Email index dropped successfully');
    } else {
      console.log('No email index found');
    }
  } catch (error) {
    console.log('Error checking or dropping email index:', error);
  }
}

// Function to insert a test user
async function insertTestUser() {
  try {
    // Ensure that the test user has a valid email (avoid duplicate key errors)
    const testUser = new User({
      name: 'Test User',
      type: 'student',
      score: 85,
      email: 'testuser@example.com' // Add a valid email to avoid the duplicate key error
    });

    await testUser.save();
    console.log('Test user inserted successfully');
  } catch (err) {
    console.log('Error inserting test user:', err);
  }
}

// Main function to execute the MongoDB operations
async function main() {
  // Drop the email index if it exists
  await dropEmailIndex();
  
  // Insert the test user
  await insertTestUser();

  // Optionally, sync indexes (if necessary)
  try {
    await User.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (err) {
    console.log('Error syncing indexes:', err);
  }
}

// Run the main function
main().then(() => {
  mongoose.disconnect();
}).catch(err => {
  console.log('Error during the main execution:', err);
  mongoose.disconnect();
});
