const mongoose = require('mongoose');

// Define a Mongoose Schema and Model for quiz records
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name
    type: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }, // User type
    score: { type: Number, min: 0, max: 100 }, // Quiz score
    date: { type: Date, default: Date.now } // Date of the quiz
});

const User = mongoose.model('User', userSchema);

module.exports = User;
