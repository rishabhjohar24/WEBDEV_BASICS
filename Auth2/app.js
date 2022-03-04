const express = require('express');
const session = require('express-session')
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('./auth');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();

app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.set(bodyParser.json());

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
}));

app.get('/auth/failure', (req, res) => {
    res.send("Failuer");
});

app.get('/protected', isLoggedIn, (req, res) =>{
    console.log(req.user);
    res.send(`hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.send('Goodbye!');
});
app.listen(3000, () => {
    console.log(`Server is listening to port : ${3000}`);
});