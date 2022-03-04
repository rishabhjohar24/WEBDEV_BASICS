const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = async (req, res, next) => {
    await Order.find()
        .populate('product', 'name')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                contains: 'All the orders till Date!',
                orders: result.map(doc => {
                    return {
                        id: doc._id,
                        quantity: doc.quantity,
                        product: doc.product,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.orders_create_order = async (req, res, next) => {
    await Product.findById(req.body.productID)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not Found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });
            return order.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Order stored!',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: 'Something went wrong'
            })
        });
}

exports.orders_get_one = async (req, res, next) => {
    await Order.findById(req.params.id)
        .populate('product')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                message: 'Order',
                orderID: result._id,
                product: result.product,
                quantity: result.quantity,
                response: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id,
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'No such order exist :('
            })
        })
}

exports.orders_delete = async (req, res, next) => {
    await Order.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).res.json({
                    message: 'No such orders'
                })
            }
            res.status(200).json({
                message: 'Order deleted Successfully!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productID: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'No such order exist :(',
                error: err
            })
        })
}