const express = require('express');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const Database = require('./models/DB.js');
const app = express();

app.use(bodyparser.urlencoded({extended : true}));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/Photo', {useNewUrlParser: true})
    .then(() => {
        console.log('Mongo is online!!');
    })
    .catch((err) => {
        console.log('Something is not good :(');
        console.log(err);
    });
app.get('/photo', async(req, res) => {
    const card = await Database.find({});
    res.render('photo/index', {card});
});

app.get('/photo/new',(req, res) => {
    res.render('photo/new')
});

app.get('/photo/:id', async(req, res) => {
    const {id} = req.params;
    const data = await Database.findOne({_id : id});
    console.log(data._id);
    res.render('photo/show', {data});
});

app.post('/photo', async (req, res) => {
    const card = new Database(req.body);
    await card.save();
    // console.log(card);
    res.redirect('photo')
});
app.get('/photo/:id/edit', async (req, res) => {
    const {id} = req.params;
    const data = await Database.findById(id);
    res.render('photo/edit',{data});
});
app.put('/photo/:id', async (req, res) =>{
    const {id} = req.params;
    const card = await Database.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/photo/${card._id}`);
});

app.delete('/photo/:id', async(req, res) =>{
    const {id} = req.params;
    const deletedPhoto = await Database.findByIdAndDelete(id);
    res.redirect('/photo');
});

app.listen(3000, () => {
    console.log('Online!!');
});