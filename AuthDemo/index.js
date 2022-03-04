const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/Auth', { useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo is Hot');
    }).catch((e) => {
        console.log('Something is fishy');
    });

app.set('views', 'views')
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'Woof!' }));

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
        req.session.user_id = user._id;
        res.send('YAY');
    }
    else {
        res.send('No');
    }
});

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    console.log(user);
    await user.save();
    req.session.user_id = user._id;
    console.log(user);
    res.redirect('/')
});

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.send("You can't see me!");
});

app.listen(3000, () => {
    console.log("Server is hot!!");
});