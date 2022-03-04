const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const ordersConroller = require('../controllers/orders');

router.get('/', checkAuth, ordersConroller.orders_get_all);

router.post('/', checkAuth, ordersConroller.orders_create_order);

router.get('/:id', checkAuth, ordersConroller.orders_get_one);

router.delete('/:id', checkAuth, ordersConroller.orders_delete);

module.exports = router;