const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    username : {type : String, required: true, unique: true},
    password: String,
    age: String
});

module.exports = mongoose.model('User', userSchema);