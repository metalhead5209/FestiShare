const express = require('express');
const router = express.Router();
const { festiSchema } = require('../schemas.js');
const asyncWrap = require('../utilities/AsyncWrap');

const ExpressError = require('../utilities/ExpressError');
const Festival = require('../models/festival');

const validateFest = (req, res, next) => {
    const { error } = festiSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }


// ROUTES

  router.get("/", asyncWrap(async (req, res) => {
    const festivals = await Festival.find({});
    res.render("festivals/index", { festivals });
  }));
  
  router.get("/new", (req, res) => {
    res.render("festivals/new");
  });
  
  router.post("/", validateFest, asyncWrap(async (req, res) => {
    // if (!req.body.festivals) throw new ExpressError('Invalid Campground Data', 400);
    const festival = new Festival(req.body.festival);
    await festival.save();
    req.flash('success', 'Successfully created new Festival!');
    res.redirect(`/festivals/${festival._id}`);
  }));
  
  router.get("/:id", asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate('reviews');
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/show", { festival });
  }));
  
  router.get("/:id/edit", asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/edit", { festival });
  }));
  
  router.put('/:id', validateFest, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival });
    req.flash('success', 'Successfully edited Festival')
    res.redirect(`/festivals/${festival._id}`);
  }));
  
  router.delete("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Festival.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Festival');
    res.redirect('/festivals');
  }));

  module.exports = router;