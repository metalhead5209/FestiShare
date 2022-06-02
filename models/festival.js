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

const options = { toJSON: { virtuals: true} };

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
    location: String,
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
}, options);

festivalSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/festivals/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    <style>
        a {
            text-decoration: none;
            color: #48cae4;
        }
    </style>`
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



 