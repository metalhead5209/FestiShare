const mongoose = require('mongoose');
const Review = require('./review');
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

festivalSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Festivals = mongoose.model('Festival', festivalSchema);
module.exports = Festivals;



 