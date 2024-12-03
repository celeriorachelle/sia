const mongoose = require('mongoose');
const User = require('../../models/user');

const uri = 'mongodb+srv://express_user:express123@cluster0.rixeg.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log(`Database: ${db.databaseName}`);
        console.log('Collections:');
        collections.forEach(collection => console.log(`- ${collection.name}`));

        // Fetch all users (optional)
        console.log('\nFetching data from the "users" collection:');
        const users = await User.find({});  // This fetches all users
        console.log(users);

        // Remove users with invalid "admin" type (if any)
        console.log('\nRemoving users with invalid "admin" type...');
        await User.deleteMany({ type: 'admin' });  // Remove records with 'admin' type

        // OR: Drop the entire users collection (this will remove all records)
        // await db.collection('users').drop();

        console.log('Removed users with invalid type "admin".');

        // Optionally: Confirm after removal
        const remainingUsers = await User.find({});
        console.log('Remaining users:', remainingUsers);

        mongoose.disconnect(); 
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
