const express = require('express');

const adminController = require('../controllers/adminController');

const router = express.Router();

const auth = require('../middlewares/auth')

router.get('/products' , adminController.getProducts);

router.post('/add-product',auth, adminController.postAddProduct );

router.post('/edit-product/:productId',auth, adminController.postEditProduct);

router.post('/delete-product/:productId' ,auth, adminController.postDeleteProduct);

module.exports = router;
