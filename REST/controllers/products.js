const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = async (req, res, next) => {
    await Product.find()
        .select('name price _id productImage')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        image: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            if (response.count >= 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({ message: "Database is empty!" });
            }
        })
        .catch(err => {
            res.status(500)
                .json({
                    error: err
                });
        });
}

exports.product_upload = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully!',
                createProduct: {
                    name: result.name,
                    price: result.price,
                    image: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.product_fetched = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('name price productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    message: 'Fetched product successfully!',
                    createProduct: {
                        name: doc.name,
                        price: doc.price,
                        image: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                });
            }
            else {
                res.status(404).json({ message: 'No data found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.product_edited = (req, res, next) => {
    const updateProps = {};
    for (const ops of req.body) {
        updateProps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: req.params.id }, { $set: updateProps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Updated!',
                response: {
                    type: 'PUT',
                    url: 'http://localhost:3000/' + req.params.id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.product_deleted = (req, res, next) => {
    Product.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted!',
                response: {
                    type: 'DELETE',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}