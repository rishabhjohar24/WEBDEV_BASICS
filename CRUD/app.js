const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const { findByIdAndDelete } = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true})
.then(() => {
    console.log("Mongo Connect!!");
})
.catch(err =>{
    console.log("Somethong is not right");
    console.log(err);
});

app.use(bodyparser.urlencoded({extended : true}));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req, res) => {
    const {category} = req.query;
    if(category){
        const products = await Product.find({category});
        res.render("products/index", {products, category});
    }
    else{
        const products = await Product.find({});
        res.render("products/index", {products, category: 'All'});
    }
});

app.get('/products/new', (req, res) => {
    res.render("products/new");
});

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect('products');
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const products = await Product.findById(id);
    console.log(products);
    res.render('products/show', {products});
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product});
});

app.put('/products/:id', async (req, res) => {
    const {id} =  req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`);
});
app.delete('/products/:id', async(req, res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(3000, () => {
    console.log('Server is Listening!!!');
});