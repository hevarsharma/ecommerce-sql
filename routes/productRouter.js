const path = require('path');

const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/products', productController.getProducts);

router.get('/:category', productController.getProductsByCategory);

router.get('/:productId', productController.getProductById);

module.exports = router;