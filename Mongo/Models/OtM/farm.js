const mongoose = require('mongoose');
const {Schema} = mongoose;

mongoose.connect('mongodb://localhost:27017/OneToMany', {useNewUrlParser: true})
    .then(() =>{
        console.log("Mongo is hot!!");
    })
    .catch((err) => {
        console.log('Errrrr');
        console.log(err);
    });

const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);
// Product.insertMany([
//     {name: 'Rishabh', price: 111, season: 'Fall'},
//     {name: 'Pradhum', price: 2131, season: 'Spring'},
//     {name: 'Sarvesh', price: 123, season: 'Winter'},
//     {name: 'Harsh', price: 231, season: 'Summer'}
// ])

const makeFarm = async () => {
    const farm = new Farm({name: 'Full Belly Farms', city: 'Manawar'});
    const melon = await Product.findOne({name:'Pradhum'});
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
}

const addProduct = async () => {
    const farm = await Farm.findOne({name: 'Full Belly Farms'});
    const watermelon = await Product.findOne({name: 'Rishabh'});
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm);
}
// makeFarm();
// addProduct();

Farm.findOne({name: 'Full Belly Farms'})
    .populate('products')
    .then(farm => console.log(farm))