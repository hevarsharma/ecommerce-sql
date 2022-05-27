const express = require('express');
//const { check, body } = require('express-validator/check');

const userController = require('../controllers/userController');
const User = require('../models/user');

const router = express.Router();

router.post('/userSignup', userController.postSignup );
router.post('/userLogin', userController.postLogin );
router.get('/users', userController.getUsers);


//router.post('/logout', authController.postLogout);


module.exports = router;
