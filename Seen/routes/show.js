const express = require('express');
const router = express.Router();
const Notification = require('../models/noti');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}

const isLoggedIn = (req, res, next) => {
    if (req.session.token) {
        return next();
    }
    console.log("Please log in first!");
    res.redirect('/user/login');
}

router.get('/list', async (req, res, next) => {
    await User.find({}).exec().then(async user => {
        return res.render('../views/show', { user })
    }).catch(error => {
        console.log({
            message: "Something went wrong",
            redirect: "Redirecting to all user page"
        });
        res.redirect('/show/list');
    })
});

router.get('/nnn', isLoggedIn, async (req, res) => {
    const token = jwt.verify(req.session.token, process.env.SECRET_KEY);
    const arr = [];
    const a = await User.findOne({ _id: token.id }).populate('notification');
    for (let i = 0; i < a.notification.length; i++) {
        const val = await User.find({ email: a.notification[i].entity });
        console.log(val);
        //arr.push(val._id);
    }
    //console.log(arr);
    return res.render('../views/noti', { a })
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const token = jwt.verify(req.session.token, process.env.SECRET_KEY);
    if (token.id !== id) {
        const noti = new Notification({
            entity: token.email,
        });
        await noti.save();
        user.notification.push(noti._id);
        user.save();
    }
    console.log(user.name);
    return res.render('../views/user', { user, ti: token.id, id });
});


module.exports = router;