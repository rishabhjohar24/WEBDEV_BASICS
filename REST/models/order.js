const mongoose = require('mongoose');
// const product = require('./product');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quantity: { type: Number, default: 1 },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);