const jwt               = require('jsonwebtoken');
const path              = require('path');
const bcrypt            = require('bcrypt');
const express           = require('express');
const methodOverride    = require('method-override');
const mongoose          = require('mongoose');
const DB                = require('./models/jwt');
const app               = express();
const JWT_SECRET        = 'fjkghasdofb@@$#!@#@#euqrrei8768jkehf';
var User_Token          = '1.1.1';

mongoose.connect('mongodb://localhost:27017/JWT', {useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})
    .then( () => {
        app.listen(3000, () => {
            console.log("Server is listening at port : 3000");
        });
    })
    .catch((e) => {
        console.log("Mongo Failure");
        console.log(e);
    });
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('register');
});

app.get('/change', (req, res) => {
    res.render('change');
})

app.put('/change/userww', async(req, res) => {
    const token = User_Token
    try{
        console.log(token);
        const match = jwt.verify(token, JWT_SECRET);
        console.log(match);
        const _id = match.Id;
        const hash = await bcrypt.hash(req.body.password, 12);
        await DB.findByIdAndUpdate(
            {_id}, 
            {
                $set: {password : hash}
            }
        );
    } 
    catch (error) {
        res.status(error, "Madarhod chhedchhad karta he");
    }
    res.send(token);
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async(req, res) => {
    const data = req.body;
    const User = await DB.findOne({username: data.username});
    const valid = await bcrypt.compare(data.password, User.password);
    if(valid){
        const token = jwt.sign(
            {
            Id : User._id,
            Name : User.name,
            UserName : User.username,
            Age : User.age
            },
            JWT_SECRET
        );
        User_Token = token;
        console.log(token);
        res.send(User);
    }
    else{
        console.log("Wrong Credentials");
        res.render('login')
    }
});

app.post('/register', async(req, res) => {
    const data = req.body;
    const hash = await bcrypt.hash(data.password, 12);
    data.password = hash;
    const User = new DB(data)
    try {
        await User.save();
        console.log("Successfully created", User);
    }
    catch (error) {
        if(error.code === 11000){
            //duplicate key
            return res.json({status :'error', error : 'Username Already exist!'});
        }
        throw error;
    }
    res.send(User);
});

