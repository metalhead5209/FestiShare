const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    rating: Number,
    body: String,
});


const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;