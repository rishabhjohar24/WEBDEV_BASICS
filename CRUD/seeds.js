const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true})
.then(() => {
    console.log("Mongo Connect!!");
})
.catch(err =>{
    console.log("Somethong is not right");
    console.log(err);
});

// const p = new Product ({
//     name: 'Ruby',
//     price: 1.99,
//     category: 'fruit'
// });

const seedsProduct = [
    {
        name: 'EggPlant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Milk',
        price: 8.00,
        category: 'dairy'
    },
    {
        name: 'Apple',
        price: 5.00,
        category: 'fruit'
    }
]

Product.insertMany(seedsProduct)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });