
//const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const Product = require('../models/product');

//  ===>>> Post a Product by admin

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const category = req.body.category;
  const description = req.body.description;
  if (!image) {
    console.log(image);
    return res.status(422).send({ message: 'image file not found.' });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    category: category,
    imageUrl: imageUrl,
  });
  product
    .save()
    .then(result => {
      console.log(req.userId);
      console.log('Created Product');
      res.status(200).send({ message: 'Product added successfuly', 'product': product });
    })
    .catch(err => {
      console.log(`...........>>>$${err}`);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//  ===>>> Get Products by admin

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.send(products);
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//  ===>>> Edit Product by admin

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updateCategory = req.body.category;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send(console.log(errors.array()[0].msg));
  }
  Product.findById(prodId)
    .then(product => {

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.category = updateCategory;

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.send({ message: 'product is successfully update.' });
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//  ===>>> Delete Product by admin

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(req.params);
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.send({message: 'Product is deleted .'})
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};