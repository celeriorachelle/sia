const express = require('express');
const router = express.Router();

router.get('/records', async function (req, res) {
    const { name, startDate, score, type, difficulty } = req.session;

    if (!name) {
        return res.status(400).send('User is not logged in');
    }

    try {
        res.render('quizRecords', {
            title: 'Quiz Records',
            records, // Pass the filtered records to the view
            name,
            score,
            startDate,
            type,
            difficulty
        });
    } catch (error) {
        console.error('Error retrieving records:', error);
        res.status(500).send('An error occurred while retrieving records.');
    }
});

module.exports = router;
