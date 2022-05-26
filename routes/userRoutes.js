const express = require('express');
const router = express.Router();
const asyncWrap = require('../utilities/AsyncWrap');
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', asyncWrap(async (req, res) => {
    try {
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const newUser = await User.register(user, password);
    req.flash('success','Welcome');
    res.redirect('/festivals');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back');
    res.redirect('/festivals')
})

module.exports = router;