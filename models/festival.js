const mongoose = require('mongoose');
const Experience = require('./experience');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
    title: String,
    location: String,
    image: String,
    price: Number,
    description: String,
    experiences: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Experience'
        }
    ]
});

festivalSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Experience.deleteMany({
            _id: {
                $in: doc.experiences
            }
        })
    }
})

const Festivals = mongoose.model('Festival', festivalSchema);
module.exports = Festivals;



 