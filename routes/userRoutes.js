const express = require('express');
const router = express.Router();
const asyncWrap = require('../utilities/AsyncWrap');
const User = require('../models/user');


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

module.exports = router;