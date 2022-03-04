const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true]
    },
    email :{
        type : String,
        unique : true,
        required : [true, "Email can't be same."],
    },
    password : {
        type : String,
        required : true
    },
    image : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'image'
    }]
});

module.exports = mongoose.model("id", idSchema);