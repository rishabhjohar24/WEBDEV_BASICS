const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageURL: String,
});

const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
