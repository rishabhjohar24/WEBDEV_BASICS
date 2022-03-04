const express               = require('express');
const bcrypt                = require('bcrypt');
const passport              = require('passport');
const localStrategy         = require('passport-local').Strategy();
const mongoose              = require('mongoose');
const methodOverride        = require('method-override');
const bodyParser            = require('body-parser');
const process               = require('dotenv').config();
const User                  = require('./models/User');
const Friend                = require('./models/friend');
const { urlencoded }        = require('express');
const { session } = require('passport');
const app                   = express();

app.use(session({
  secret: 'fafjdhguyt674238r9393424$#$#%$',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride.apply('_method'));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  ID.findById(id, (err, user) => {
      done(err, user);
  });
});

passport.use(new localStrategy((email, password, done) => {
  User.findOne({username : email}, (err, user) => {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false, {mewssage: 'Incorret Email'});
    }
    bcrypt.compare(password, user.passport, (err, res) => {
      if(err) {
        return done(err)
      };
      if(res === false) {
        done(null, false, {message: 'Incorrect Password'})
      };
      return done(null, user);
    });
  });
}));
function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  console.log("Please log in first");
  res.redirect('/register');
}
function isLoggedOut(req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }
  console.log("Please logOut first!");
  res.redirect('/user');
}
mongoose.connect()