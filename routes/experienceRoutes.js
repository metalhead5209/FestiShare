const express = require('express');
const router = express.Router({mergeParams: true});
const experiences = require('../controllers/experienceController');
const { experienceSchema } = require('../schemas.js');
const Experience = require('../models/experience');
const Festival = require('../models/festival');
const { validateExperience, loggedIn, isContributorAuthor } = require('../middleware')

const ExpressError = require('../utilities/ExpressError')
const asyncWrap = require('../utilities/AsyncWrap');

  
// ***** ROUTES *****
//  New experience route
router.post('/', loggedIn, validateExperience, asyncWrap(experiences.newExperience));

//  Delete experience
router.delete('/:experienceId', loggedIn, isContributorAuthor, asyncWrap(experiences.deleteExperience));

  module.exports = router;