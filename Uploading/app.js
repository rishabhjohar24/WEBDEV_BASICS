const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const ID = require("./models/id");
const Image = require("./models/image");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { findByIdAndUpdate, find } = require("./models/id");
const app = express();

app.use(methodOverride('_method'));
app.use(session({
    secret: 'Woof!',
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    ID.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new localStrategy((email, password, done) => {
    console.log(email);
    ID.findOne({ username: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect Email' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return done(err);
            }
            if (res === false) {
                return done(null, false, { message: 'Incorrect Password' });
            }
            return done(null, user);
        })
    });
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/Project1', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Mongo is hot!!");
    })
    .catch((e) => {
        console.log(e);
    });

//helper function for checki logged in and logout
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("Please log in first!");
    res.redirect('/register');
}
function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    console.log("Please logOut first!");
    res.redirect('/show');
}

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.get('/new', isLoggedIn, (req, res) => {
    console.log("HI");
    res.render('new', { name: req.user.name });
});

app.get('/user', async (req, res) => {
    const findUser = await ID.find({});
    console.log(findUser);
    res.render('user', { user: findUser });
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const findUser = await ID.findById(id).populate('image');
    res.render('userinfo', { x: findUser.image, y: findUser });
})

app.get('/photo/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const findUser = await ID.findOne({ image: { $in: id } });
    const imageData = await Image.findById(id);
    if (req.user._id.equals(undefined)) {
        return res.render('card', { idb: imageData, owner: findUser._id, curr: "dasdads" });
    }
    res.render('card', { idb: imageData, owner: findUser._id, curr: req.user._id });
})

app.get('/photo/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const imageData = await Image.findById(id);
    const findUser = await ID.findOne({ image: id });
    if (findUser._id.equals(req.user._id)) {
        return res.render('edit', { data: imageData });
    }
    console.log("Access Denied!");
    res.redirect('/show');
});

app.put('/photo/:id', async (req, res) => {
    const { id } = req.params;
    const imageData = await Image.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/photo/${id}`);
})

app.get('/show', async (req, res) => {
    const images = await Image.find({});
    const users = await ID.find({});
    res.render('index', { im: images, us: users });
});

app.get('/register', isLoggedOut, (req, res) => {
    res.render('register');
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/show');
});

app.post('/photo', async (req, res) => {
    const { imageURL, desc, title, name } = req.body;
    const findUser = await ID.findOne({ email: req.user.email });
    const images = new Image({
        user_id: findUser._id,
        imageURL,
        desc,
        title,
        name
    });
    await images.save();
    console.log(images);
    findUser.image.push(images._id);
    await findUser.save();
    res.render('card', { idb: images, curr: findUser._id, owner: findUser._id });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/show',
    failureRedirect: '/',
    failureMessage: 'Lawda lele',
}));

app.post('/register', async (req, res) => {
    const { email, username, password, name } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new ID({
        name,
        username,
        email,
        password: hash
    });
    // req.session.user_id = user._id;
    await user.save();
    res.redirect('/show');
});

app.listen(3000, (req, res) => {
    console.log("Server is Listening!");
});