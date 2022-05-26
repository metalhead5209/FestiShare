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
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success','Welcome');
        res.redirect('/festivals');
    })
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
    const redirectUrl = req.session.returnTo || '/festivals';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout(er => {
        if (er) {return next(err);}
    });
    req.flash('success', 'succesfully logged out');
    res.redirect('/festivals');
});

module.exports = router;