const express = require('express');
const router = express.Router();
const festivals = require('../controllers/festiController');
const asyncWrap = require('../utilities/AsyncWrap');
const { loggedIn, validateFest, isContributor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/config');
const upload= multer({ storage });

const Festival = require('../models/festival');



// ***** ROUTES *****

// Festival index page
  router.get("/", asyncWrap(festivals.festIndex));
  
  // New festival form
  router.get("/new", loggedIn, festivals.newFestForm);

  // New festival post route
  router.post("/", loggedIn, upload.array('image'), validateFest, asyncWrap(festivals.createFest));
  
  // Festival show page
  router.get("/:id", asyncWrap(festivals.showPage));
  
  // Festival edit page
  router.get("/:id/edit", loggedIn, isContributor, asyncWrap(festivals.editPage));

  // Festival edit route
  router.put('/:id', loggedIn, isContributor, upload.array('image'), validateFest, asyncWrap(festivals.editFest));
  
  // Festival delete route
  router.delete("/:id", loggedIn, isContributor, asyncWrap(festivals.deleteFest));

  module.exports = router;