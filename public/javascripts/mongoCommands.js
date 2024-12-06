const mongoose = require('mongoose');
const User = require('../../models/user');

const uri = 'mongodb+srv://express_user:express123@cluster0.rixeg.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const users = await User.find({});
            
            if (users.length === 0) {
                console.log('No records found in the "users" collection.');
            } else {
                console.log('Records in the "users" collection:');
                users.forEach(user => console.log(user));
            }
        } catch (error) {
            console.error('Error fetching records from the "users" collection:', error);
        } finally {
            mongoose.connection.close(); // Close the connection after the operation
        }
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
