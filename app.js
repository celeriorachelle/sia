const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

const indexRouter = require('./routes/index');
const quizRouter = require('./routes/quiz');
const aboutusRouter = require('./routes/aboutUs');
const trendingRouter = require('./routes/Trendings');
const quizRecordsRouter = require('./routes/quizRecords');
const quizRegisterRouter = require('./routes/quizRegister');

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use general middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Example middleware for testing
const myMiddleware = (req, res, next) => {
    console.log('Middleware executed');
    next();
};
app.use(myMiddleware);


// Connect to your MongoDB database
mongoose.connect('mongodb+srv://express_user:express123@cluster0.rixeg.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Test route
app.use('/', indexRouter);
app.use('/quiz', quizRouter);
app.use('/aboutUs', aboutusRouter);
app.use('/Trendings', trendingRouter);
app.use('/quizRecords', quizRecordsRouter);
app.use('/quizRegister', quizRegisterRouter);

module.exports = app; // Export the app object
