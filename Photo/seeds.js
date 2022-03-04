const mongoose = require('mongoose');
const DB = require('./models/DB.js');
mongoose.connect('mongodb://localhost:27017/Photo', {useNewUrlParser: true})
    .then(() => {
        console.log('Mongo is online!!');
    })
    .catch((err) => {
        console.log('Something is not good :(');
        console.log(err);
    });

const seedsProduct = [
    {
        author: 'Rishabh',
        title: 'Home',
        desc: 'Great view of manawar home',
        imageURL: 'https://www.hinduamerican.org/wp-content/uploads/2020/06/20120510012-scaled.jpg'
    },
    {
        author: 'Sarvesh',
        title: 'mandir',
        desc: 'Great view of manawar mandir',
        imageURL: 'https://www.hinduamerican.org/wp-content/uploads/2020/06/20120510012-scaled.jpg'
    },
    {
        author: 'Pradhum',
        title: 'village',
        desc: 'Great view of manawar village',
        imageURL: 'https://www.hinduamerican.org/wp-content/uploads/2020/06/20120510012-scaled.jpg'
    },
    {
        author: 'Kartavya',
        title: 'villa',
        desc: 'Great view of manawar villa',
        imageURL: 'https://www.hinduamerican.org/wp-content/uploads/2020/06/20120510012-scaled.jpg'
    }
];

DB.insertMany(seedsProduct)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })