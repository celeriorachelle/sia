const mongoose = require('mongoose');

// Define a Mongoose Schema and Model for quiz records
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name
    type: { type: String, enum: ['student', 'teacher', 'others'], default: 'student' }, // User type
    score: { type: Number, min: 0, max: 100 }, // Quiz score
    date: { type: Date, default: Date.now }, // Date of the quiz
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }, // Quiz difficulty
});

const User = mongoose.model('User', userSchema);

module.exports = User;
