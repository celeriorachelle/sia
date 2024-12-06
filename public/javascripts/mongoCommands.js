const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../../models/user');

const uri = 'mongodb+srv://express_user:express123@cluster0.rixeg.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const askUser = () => {
            rl.question(
                'What would you like to do? (view: View all records, delete: Delete all records, exit: Exit): ',
                async (answer) => {
                    switch (answer.toLowerCase()) {
                        case 'view':
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
                            }
                            break;
                        case 'delete':
                            try {
                                const result = await User.deleteMany({});
                                console.log(`${result.deletedCount} record(s) deleted from the "users" collection.`);
                            } catch (error) {
                                console.error('Error deleting records from the "users" collection:', error);
                            }
                            break;
                        case 'exit':
                            console.log('Exiting...');
                            rl.close();
                            mongoose.connection.close();
                            return;
                        default:
                            console.log('Invalid input. Please type "view", "delete", or "exit".');
                            break;
                    }
                    askUser(); // Ask again after processing the input
                }
            );
        };

        askUser();
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
