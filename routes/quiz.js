const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user'); // Import your User model

// Decode HTML entities in quiz questions and answers
function decodeHtmlEntities(text) {
    const entities = {
        '&amp;': '&',
        '&quot;': '"',
        '&#039;': "'",
        '&lt;': '<',
        '&gt;': '>',
        '&nbsp;': ' ',
    };
    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity);
}

// Start quiz route
router.get('/start', async function (req, res, next) {
    const { name, startDate, type } = req.session;
    if (!name || !startDate || !type) {
        return res.status(400).send('Session data is incomplete');
    }

    var difficulty = req.query.difficulty || 'easy';
    var amount = req.query.amount || 10;

    var apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=11&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await axios.get(apiUrl);
        const decodedQuestions = response.data.results.map((question) => {
            return {
                ...question,
                question: decodeHtmlEntities(question.question),
                correct_answer: decodeHtmlEntities(question.correct_answer),
                incorrect_answers: question.incorrect_answers.map(decodeHtmlEntities),
            };
        });
        req.session.correctAnswers = decodedQuestions.map((q) => q.correct_answer);
        res.render('quiz_start', { questions: decodedQuestions, name, startDate, type, difficulty });
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).send('An error occurred while fetching quiz questions.');
    }
});

// Submit quiz answers and save score
router.post('/submit', async (req, res) => {
    const { name, answers, difficulty } = req.body; 

    if (!name || !answers || !difficulty) {
        return res.status(400).json({ error: 'Name, answers, and difficulty are required' });
    }

    try {
        const correctAnswers = req.session.correctAnswers || [];
        let calculatedScore = 0;

        // Check if the number of answers matches the expected number
        if (Object.keys(answers).length !== correctAnswers.length) {
            return res.status(400).json({ error: 'Answers do not match the number of questions' });
        }

        // Calculate the score based on the answers
        Object.keys(answers).forEach((key) => {
            if (answers[key] === correctAnswers[key]) {
                calculatedScore++;
            }
        });

        // Find the user in the database and update the score and difficulty
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Update the user's score and difficulty
        user.score = calculatedScore;
        user.difficulty = difficulty;  // Update difficulty to the new one selected by the user
        await user.save();

        req.session.score = calculatedScore;      

        // Send a JSON response with the redirect URL
        res.json({ redirectUrl: '/quiz/records' });
    } catch (error) {
        console.error('Error updating quiz score:', error);
        res.status(500).json({ error: 'An error occurred while updating the quiz score.' });
    }
});


// View user profile and quiz records
router.get('/records', async function (req, res) {
    const { name, startDate, score, type, difficulty } = req.session;

    if (!name) {
        return res.status(400).send('User is not logged in');
    }

    try {
        let filter = {};

        // Apply filters only if query parameters are present
        if (req.query.name && req.query.name.trim() !== '') {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.score && req.query.score.trim() !== '') {
            filter.score = parseInt(req.query.score, 10);
        }

        if (req.query.type && req.query.type.trim() !== '') {
            filter.type = req.query.type;
        }

        if (req.query.startDate && req.query.startDate.trim() !== '') {
            const parsedStartDate = new Date(req.query.startDate);
            parsedStartDate.setHours(0, 0, 0, 0);
            filter.date = { $gte: parsedStartDate };
        }

        if (req.query.difficulty && req.query.difficulty.trim() !== '') {
            filter.difficulty = req.query.difficulty;
        }

        let sortOrder = 1;  // Default is ascending order
        if (req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc') {
            sortOrder = -1;  // Descending order
        }

        const records = await User.find(filter).sort({ score: sortOrder });

        res.render('quizRecords', {
            title: 'Quiz Records',
            records,
            name,
            score,
            startDate,
            type,
            difficulty,
            sortOrder: req.query.sortOrder,
        });
    } catch (error) {
        console.error('Error retrieving records:', error);
        res.status(500).send('An error occurred while retrieving records.');
    }
});



module.exports = router;