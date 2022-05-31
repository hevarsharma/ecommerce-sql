const mySqlConnection = require('../config/dbConfig');

const { validationResult } = require('express-validator/check');

exports.postOrder = (req, res, next) => {


  const productId = req.params.productId;

  const userId = req.userId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  try {

    info = {
      userId: userId,
      productId: productId
    }
    sql = 'INSERT INTO orders SET ?'
    mySqlConnection.query(sql, info, async (err, result, field) => {
      if (!err) {
        res.send({
          message: "Order placed successfully.",
          order: result[0]
        })
      }
      else {
        res.send({
          'code': 204,
          error: err
        })
      }
    });

  } catch (er) {
    res.send({ er: er });
  }

};

exports.getOrders = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  try {

    mySqlConnection.query(`SELECT * FROM orders WHERE userId = ${req.userId}`, async (err, result, field) => {
      
      if (!err) {

        if(result === []){
          res.send({
            'code': 200,
            orders: result
          });
        }else{
          res.send({
            message:'user has not placed any orders... '
          })
        }
        
      }
      else {
        res.send({
          'code': 204,
          error: err
        });
      }
    })
  }
  catch (er) {
    res.send({
      'code': 204,
      error: er
    });
  }

}

