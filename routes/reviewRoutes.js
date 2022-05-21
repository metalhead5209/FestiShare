const express = require('express');
const router = express.Router({mergeParams: true});
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review');
const Festival = require('../models/festival');

const ExpressError = require('../utilities/ExpressError');
const asyncWrap = require('../utilities/AsyncWrap');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }
  
// ROUTES
router.post('/', validateReview, asyncWrap(async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    const review = new Review(req.body.review);
    festival.reviews.push(review);
    await review.save();
    await festival.save()
    res.redirect(`/festivals/${festival._id}`);
  }));
  
router.delete('/:reviewId', asyncWrap(async (req, res) => {
    const { id, reviewId } = req.params;
    await Festival.findByIdAndUpdate(id, { $pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/festivals/${id}`);
  }));

  module.exports = router;