const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
    title: String,
    location: String,
    image: String,
    price: Number,
    description: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

const Festivals = mongoose.model('Festival', festivalSchema);
module.exports = Festivals;



 