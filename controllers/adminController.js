const mySqlConnection = require('../config/dbConfig');

const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

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

  const product = {
    title: title,
    price: price,
    description: description,
    category: category,
    imageUrl: imageUrl,
  };

  mySqlConnection.query('INSERT INTO products SET ?', product, async (err, result, fields) => {
    if (!err) {
      res.send({
        message: 'Product added successfuly',
        Product: result[0]
      });
    }
    else {
      res.send({ error: err })
      console.log(err);
    }
  });

};

//  ===>>> Get Products by admin

exports.getProducts = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  mySqlConnection.query("SELECT * FROM products", async (err, products, field) => {

    try {
      if (!err) {
        res.send({
          message: 'Success',
          Products: products
        });
      }
      else {
        res.send({ error: err })
        console.log(err);
      }
    } catch (er) {
      res.send({ er: er })
      console.log(er);
    }
  })

};

//  ===>>> Edit image of Product by admin

exports.postEditProduct = (req, res, next) => {

  let id = req.params.productId;
  let image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  mySqlConnection.query(`SELECT * FROM products WHERE id = ${id}`, async (err, product, field) => {

    try {
      if (product[0].length !== -1) {

        if (image) {

          fileHelper.deleteFile(product[0].imageUrl);

          mySqlConnection.query(`UPDATE products SET imageUrl = '${image.path}' WHERE id = '${id}'`, (err, result) => {
            if (!err) {
              res.send({ message: "Product Updated Successfully" });
              console.log(result);
            }
            else {
              res.send({ message: err });
              console.log(err);
            }
          })
        }
        else {
          res.send({ message: 'image path is not dined....' });
        }

      }
      else {
        res.send({
          message: 'product is not defined....',
          error: err
        });
      }
    } catch (er) {
      res.send({ err: er });
    }
  })

};

//  ===>>> Delete Product by admin

exports.postDeleteProduct = (req, res, next) => {

  const prodId = req.params.productId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  try {

    mySqlConnection.query(`SELECT * FROM products WHERE id = ${prodId}`, async (err, product, field) => {

      if (product[0] !== -1) 
      {
        fileHelper.deleteFile(product[0].imageUrl);

        mySqlConnection.query(`DELETE FROM products WHERE id = ${prodId}`, async (err, result, fields) => {
          res.send({message: 'Product delete successfully'});
        });
      }
      else{
        res.send({err: 'product not found....'});
      }

    })

  }catch(er){
    console.log(res.send({err: er}));
  }

};