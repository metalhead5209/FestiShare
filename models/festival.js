const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Festivals = mongoose.model('Festival', festivalSchema);
module.exports = Festivals;



 