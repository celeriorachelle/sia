const express = require('express');
const router = express.Router();

// GET route to render the registration form
router.get('/', (req, res) => {
    res.render('quizregister', { title: 'Register', startDate: '' });
});

// POST route to handle form submission and redirect to quiz lobby
router.post('/', (req, res) => {
    const { name, startDate, type } = req.body;

    // Save the data to the session
    req.session.name = name;
    req.session.startDate = startDate;
    req.session.type = type;

    console.log('Session Data:', req.session);
    res.render('quiz', { name, startDate, type });
});


module.exports = router; // Must export the router
