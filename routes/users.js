const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Render form to create a new user
router.get('/quizRecords', (req, res) => {
    res.render('quizRecords');
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Render form to edit an existing user
router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('edit', { user });
    } catch (err) {
        res.status(500).send(err);
    }
});

// READ a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('view', { user });
    } catch (err) {
        res.status(500).send(err);
    }
});

// UPDATE a user by ID
router.post('/:id/update', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE a user by ID
router.post('/:id/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;