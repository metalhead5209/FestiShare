const express = require('express');
const router = express.Router({mergeParams: true});
const { experienceSchema } = require('../schemas.js');
const Experience = require('../models/experience');
const Festival = require('../models/festival');

const ExpressError = require('../utilities/ExpressError');
const asyncWrap = require('../utilities/AsyncWrap');


const validateExperience = (req, res, next) => {
    const {error} = experienceSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }
  
// ROUTES
router.post('/', validateExperience, asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    const experience = new Experience(req.body.experience);
    festival.experiences.push(experience);
    await experience.save();
    await festival.save()
    req.flash('success', 'SUCCESS! Thank you for sharing your Experience!!')
    res.redirect(`/festivals/${festival._id}`);
  }));
  
router.delete('/:experienceId', asyncWrap(async (req, res) => {
    const { id, experienceId } = req.params;
    await Festival.findByIdAndUpdate(id, { $pull: {experiences: experienceId} });
    await Experience.findByIdAndDelete(req.params.experienceId);
    req.flash('success', 'Experience successfully deleted')
    res.redirect(`/festivals/${id}`);
  }));

  module.exports = router;