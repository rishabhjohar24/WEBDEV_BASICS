const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    entity: String
});

module.exports = mongoose.model('noti', notificationSchema);