const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET route to render the registration form
router.get('/', (req, res) => {
    res.render('quizregister', { title: 'Register', startDate: '' });
});

// POST route to handle form submission and redirect to quiz lobby
router.post('/', async (req, res) => {
    const { name, startDate, score, type, difficulty } = req.body; // Assuming only name and type are needed

    try {
        // Save the registration data to the User model
        const user = new User({
            name,
            type,
            score: 0, // Default score to 0 on registration
            date: new Date(), // Set the current date and time for registration
            difficulty: difficulty || 'easy', // Default difficulty to 'easy' if none is provided
        });

        // Save the new user to the database
        await user.save();

        // Store some data in session if needed
        req.session.name = name;
        req.session.startDate = startDate;  // Storing startDate in session
        req.session.score = score;
        req.session.type = type;
        req.session.difficulty = difficulty;

        console.log('User registered:', user);
        res.render('quiz', { name, type }); // Redirect or render the quiz page
    } catch (error) {
        console.error('Error saving user to the database:', error);
        res.status(500).send('An error occurred while saving registration data.');
    }
});



module.exports = router; // Must export the router
