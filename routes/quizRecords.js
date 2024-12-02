const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* User List. */
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('quizRecords', { title: 'User Quiz List', users });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
