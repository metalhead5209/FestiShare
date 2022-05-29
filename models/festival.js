const mongoose = require('mongoose');
const Experience = require('./experience');
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
    url: String,
    filename: String
});

ImgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})


const festivalSchema = new Schema({
    title: String,
    location: String,
    images: [ImgSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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



 