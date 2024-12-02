var express = require('express');
var router = express.Router();
const axios = require('axios');
const QuizRecord = require('../models/user'); // Import your QuizRecord model

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

// Example routes for quiz functionality
router.get('/start', async function (req, res, next) {
  const { name, startDate, type } = req.session;
  console.log('Session Data:', req.session);

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

      // Pass session data directly to EJS
      res.render('quiz_start', { 
          questions: decodedQuestions, 
          name: name, 
          startDate: startDate, 
          type: type 
      });
  } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).send('An error occurred while fetching quiz questions.');
  }
});

// POST route to handle quiz submission
router.post('/submit', async (req, res) => {
  const { name, startDate, type, answers } = req.body;  // Destructure answers from req.body

  if (!name || !answers) {
      return res.status(400).json({ error: 'Name and answers are required' });
  }

  try {
      // Calculate the score based on answers
      const correctAnswers = req.session.correctAnswers || [];
      let calculatedScore = 0;

      Object.keys(answers).forEach((key) => {
          if (answers[key] === correctAnswers[key]) {
              calculatedScore++;
          }
      });

      // Create a new quiz record
      const newQuizRecord = new QuizRecord({
          name,
          type,
          score: calculatedScore, // Set the calculated score
          date: new Date() // Set the current date as the quiz submission date
      });

      // Save the record to the database
      await newQuizRecord.save();

      // Respond with the calculated score
      res.json({ score: calculatedScore });

  } catch (error) {
      console.error('Error saving quiz record:', error);
      res.status(500).json({ error: 'An error occurred while saving the quiz record' });
  }
});

module.exports = router;

// Endpoint to view quiz records
router.get('/records', async function (req, res) {
  try {
    const { name, score, startDate, type } = req.query;
    const records = await QuizRecord.find({ name: new RegExp(name, 'i') }).sort({ date: -1 });
    res.render('quizRecords', { title: 'Quiz Records', records, name, score, startDate, type });
  } catch (error) {
    console.error('Error fetching quiz records:', error);
    res.status(500).send('An error occurred while fetching quiz records.');
  }
});

// Export the router
module.exports = router;
