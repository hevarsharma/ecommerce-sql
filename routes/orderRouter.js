const path = require('path');

const express = require('express');

const orderController = require('../controllers/orderController');

const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/:productId', auth ,orderController.postOrder);

router.get('/allOrders', auth, orderController.getOrders);

module.exports = router;