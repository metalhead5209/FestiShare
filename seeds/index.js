const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedNames');
const Festival = require('../models/festival');



const DB = 'mongodb://127.0.0.1:27017/festiShare';
mongoose.connect(DB,
    () => {
        console.log('CONNECTED TO DB');
    },
    e => console.error(e, 'NO CONNECTION')
);

const mix = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    for (let i = 0; i < 50; i++) {
        const randThou = Math.floor(Math.random() * 1000);
        const fest = new Festival({
            location: `${cities[randThou].city}, ${cities[randThou].state}`,
            title: `${mix(descriptors)} ${mix(places)}`
        })
        await fest.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
});

