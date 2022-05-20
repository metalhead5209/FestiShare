const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: Number,
    body: String,
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;