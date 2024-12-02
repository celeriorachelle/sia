const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* User List. */
router.get('/', async (req, res) => {
    try {
        // Access session data stored from quiz register
        const { name, startDate, type } = req.session;

        // Build the search query dynamically based on session data
        let searchQuery = {};

        if (name) {
            searchQuery.name = new RegExp(name, 'i'); // Case-insensitive match
        }
        if (startDate) {
            searchQuery.date = { $gte: new Date(startDate) }; // From start date onward
        }
        if (minScore) {
            searchQuery.score = { $gte: minScore }; // Minimum score
        }
        if (maxScore) {
            if (!searchQuery.score) searchQuery.score = {}; // If minScore was not provided
            searchQuery.score.$lte = maxScore; // Maximum score
        }
        if (type) {
            searchQuery.type = type; // User type filter
        }

        // Fetch the users from the database based on the searchQuery
        const records = await User.find(searchQuery);

        // Render the results on the quizRecords page, passing the session data as well
        res.render('quizRecords', { records, name, startDate, type });
    } catch (err) {
        console.error('Error fetching quiz records:', err);
        res.status(500).send('An error occurred while fetching quiz records.');
    }
});

module.exports = router;