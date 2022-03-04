const mongoose = require('mongoose');

const userSchem = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    notification: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'noti'
    }]
});

module.exports = mongoose.model('user', userSchem);