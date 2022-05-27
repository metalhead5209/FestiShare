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
    for (let i = 0; i < 5; i++) {
        const randThou = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *200) + 10;
        const fest = new Festival({
            contributor: '62909bdb623feb28a2be8871',
            location: `${cities[randThou].city}, ${cities[randThou].state}`,
            title: `${mix(descriptors)} ${mix(places)}`,
            image: 'https://source.unsplash.com/collection/3155144',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio non soluta consequatur, quos ut aliquam. Aspernatur earum vero sequi, ut sapiente nihil enim explicabo, numquam incidunt accusamus quod possimus nulla.',
            price
        })
        await fest.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
});

