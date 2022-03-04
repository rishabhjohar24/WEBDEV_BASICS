const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    imageURL: String,
    desc : String,
    title : String,
    date: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("image", imageSchema);