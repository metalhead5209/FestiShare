const express = require('express');
const router = express.Router();
const asyncWrap = require('../utilities/AsyncWrap');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/userController');

//  ***** ROUTES *****

// Register page
router.get('/register', users.registerPage)

//  Register route
router.post('/register', asyncWrap(users.registerRoute));

// Login page
router.get('/login', users.loginPage);

// login Route
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginRoute);

// logout route 
router.get('/logout', users.logoutRoute);

module.exports = router;