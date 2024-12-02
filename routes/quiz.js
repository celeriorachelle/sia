var express = require('express');
var router = express.Router();  // Make sure you are using express.Router() properly
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
  const { name } = req.query;
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

      res.render('quiz_start', { questions: decodedQuestions, name });
  } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).send('An error occurred while fetching quiz questions.');
  }
});


//POST endpoint for submitting quiz results
router.post('/submit', async function (req, res) {
  try {
    const { name, answers } = req.body;

    // Validate if answers are submitted
    if (!answers) {
      return res.status(400).send('Please complete the quiz before submitting.');
    }

    // Calculate the score
    let score = 0;

    // Assume that correct answers are stored in the `correctAnswers` array from the API response
    const correctAnswers = req.session.correctAnswers || [];  // Store correct answers temporarily (maybe in session)

    Object.keys(answers).forEach((index) => {
      if (answers[index] === correctAnswers[index]) {
        score++;
      }
    });

    // Save the result to the database
    const newRecord = new QuizRecord({ name, score, date: new Date() });
    await newRecord.save();

    res.redirect(`/quiz/records?name=${encodeURIComponent(name)}&score=${score}`);
  } catch (error) {
    console.error('Error calculating quiz score:', error);
    res.status(500).send('An error occurred while calculating the quiz score.');
  }
});


// Endpoint to view quiz records
router.get('/records', async function (req, res) {
  try {
    const { name, score } = req.query;
    const records = await QuizRecord.find({ name: new RegExp(name, 'i') }).sort({ date: -1 });
    res.render('quizRecords', { title: 'Quiz Records', records, name, score });
  } catch (error) {
    console.error('Error fetching quiz records:', error);
    res.status(500).send('An error occurred while fetching quiz records.');
  }
});

// Export the router
module.exports = router;
