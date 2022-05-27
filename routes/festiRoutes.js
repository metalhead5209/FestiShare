const express = require('express');
const router = express.Router();
const asyncWrap = require('../utilities/AsyncWrap');
const { loggedIn, validateFest, isContributor } = require('../middleware');

const Festival = require('../models/festival');



// ROUTES

  router.get("/", asyncWrap(async (req, res) => {
    const festivals = await Festival.find({});
    res.render("festivals/index", { festivals });
  }));
  
  router.get("/new", loggedIn, (req, res) => {
    res.render("festivals/new");
  });
  
  router.post("/", loggedIn, validateFest, asyncWrap(async (req, res) => {
    const festival = new Festival(req.body.festival);
    festival.contributor = req.user._id;
    await festival.save();
    req.flash('success', 'Successfully created new Festival!');
    res.redirect(`/festivals/${festival._id}`);
  }));
  
  router.get("/:id", asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate({
      path:'experiences',
      populate: {
        path: 'contributor'
      }
  }).populate('contributor');
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/show", { festival });
  }));
  
  router.get("/:id/edit", loggedIn, isContributor, asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/edit", { festival });
  }));
  
  router.put('/:id', loggedIn, isContributor, validateFest, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival });
    req.flash('success', 'Successfully edited Festival')
    res.redirect(`/festivals/${festival._id}`);
  }));
  
  router.delete("/:id", loggedIn, isContributor, asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Festival.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Festival');
    res.redirect('/festivals');
  }));

  module.exports = router;