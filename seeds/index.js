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
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio non soluta consequatur, quos ut aliquam. Aspernatur earum vero sequi, ut sapiente nihil enim explicabo, numquam incidunt accusamus quod possimus nulla.',
            price,
            images: [
                
      {
        url: 'https://res.cloudinary.com/festishare/image/upload/v1653824003/FestiShare/ocigaoqolzjoo3rk10qe.jpg',
        filename: 'FestiShare/ocigaoqolzjoo3rk10qe'
      },
      {
        url: 'https://res.cloudinary.com/festishare/image/upload/v1653824002/FestiShare/qfmk3ini763ranrgbrr9.jpg',
        filename: 'FestiShare/qfmk3ini763ranrgbrr9'
      },
      {
        url: 'https://res.cloudinary.com/festishare/image/upload/v1653824002/FestiShare/kk6j3gmq0jtvpzmgbqot.jpg',
        filename: 'FestiShare/kk6j3gmq0jtvpzmgbqot'
      }
    
            ]
        })
        await fest.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
});

