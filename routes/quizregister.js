const express = require('express');
const router = express.Router();

// GET route to render the registration form
router.get('/', (req, res) => {
    res.render('quizregister', { title: 'Register' });
});

// POST route to handle form submission and redirect to quiz lobby
router.post('/', (req, res) => {  
    const { name } = req.body;
    res.render('quiz', { name });
});

module.exports = router; // Must export the router
