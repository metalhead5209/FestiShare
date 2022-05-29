const mongoose = require('mongoose');
const Experience = require('./experience');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
    title: String,
    location: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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



 