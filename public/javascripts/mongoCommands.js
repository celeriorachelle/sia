const mongoose = require('mongoose');
const User = require('../../models/user');
const readline = require('readline');

const uri = 'mongodb+srv://express_user:express123@cluster0.rixeg.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Delete all records? (Y/N): ', async (answer) => {  // Make this callback async
            if (answer.toUpperCase() === 'Y') {
                rl.question('Are you sure? (Y/N): ', async (answer) => {  // Make this callback async
                    if (answer.toUpperCase() === 'Y') {
                        try {
                            const db = mongoose.connection.db;
                            const collections = await db.listCollections().toArray();

                            console.log(`Database: ${db.databaseName}`);
                            console.log('Collections:');
                            collections.forEach(collection => console.log(`- ${collection.name}`));

                            console.log();

                            await db.collection('users').drop();

                            console.log('All records from the "users" collection have been cleared.');

                            // Optionally: Confirm after dropping
                            const remainingUsers = await User.find({});
                            console.log('Remaining users:', remainingUsers);  // This should be an empty array

                        } catch (error) {
                            console.error('Error clearing the "users" collection:', error);
                        }
                    }
                    rl.close();  // Close the readline interface after user input is done
                });
            } else {
                console.log('Operation cancelled.');
                rl.close();  // Close the readline interface if the user cancels
            }
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
