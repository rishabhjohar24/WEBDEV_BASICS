const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const headers = require('headers');
const router = express.Router();

const User = require('../models/user');

const isLoggedOut = (req, res, next) => {
    if (!req.session.token) {
        return next();
    }
    console.log("Please logOut first!");
    res.redirect('/show/list');
}

const isLoggedIn = (req, res, next) => {
    if (req.session.token) {
        return next();
    }
    console.log("Please log in first!");
    res.redirect('/user/login');
}

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('../views/login')
});
router.post('/login', isLoggedOut, async (req, res, next) => {
    const { email, password } = req.body;
    await User.find({ email: email }).exec().then(async user => {
        bcrypt.compare(password, user[0].password, (err, result) => {
            if (result) {
                req.session.token = jwt.sign({
                    id: user[0]._id,
                    email: user[0].email,
                    name: user[0].name
                }, process.env.SECRET_KEY, { expiresIn: '30m' });
                return res.redirect(`/show/list`);
            } else {
                console.log('No such user exits/ Invalid Credentials');
                return res.redirect('/user/login');
            }
        });
    }).catch(() => {
        console.log(`${email} does not exist`);
        return res.redirect('/user/login');
    });
});
router.get('/register', isLoggedOut, (req, res, next) => {
    res.render('../views/register');
});
router.post('/register', isLoggedOut, async (req, res, next) => {
    const { name, email, password } = req.body
    User.find({ email: email }).exec().then(user => {
        if (user.length > 1) {
            return res.json({
                meassage: 'Mail exist!'
            });
        }
        else {
            bcrypt.hash(password, 12, (err, hash) => {
                if (err) {
                    console.log({
                        message: 'Password cannot be created!'
                    });
                    return res.redirect('/user/register');
                }
                else {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hash
                    });
                    user.save().then(() => {
                        console.log({
                            message: `User ${name} is succesfully created!`
                        });
                        req.session.token = jwt.sign({
                            id: user._id,
                            name: name,
                            email: email
                        }, process.env.SECRET_KEY);
                        return res.redirect('/show/list');
                    }).catch(err => {
                        console.log(err);
                        return res.redirect('/user/register');
                    });
                }
            });
        }
    });
});
router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});

module.exports = router;