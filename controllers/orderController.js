const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order')

exports.postOrder = (req, res, next) => {
    
    try {
        const productId = req.params.productId;

        const userId = req.userId;

        User.findById(userId)
            .then(user => {
                //console.log(user);
                Product.findById(productId)
                    .then(product => {
                        //console.log(product);
                        const order = new Order({
                            product: product,
                            user: user
                        });
                        return order.save()
                    })
                    .then(result => {
                        console.log('Order Created');
                        res.status(200).send({ message: 'Product Ordered successfuly',order: result });
                    })
                    .catch(err => {
                        console.log(`...........>>>$${err}`);
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
            })
            .catch(err => {
                console.log(`...........>>>$${err}`);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);

            })
    } catch (err) {
        console.log(err);
        res.send({ message: err });
    };

};

exports.getOrders = (req, res, next) => {

    Order.find()
    .then(orders => {
        var userOrders =  orders.filter(function(order) {
            return order.user._id == req.userId;
          });
          console.log(userOrders)
      res.send(userOrders);
    })
    .catch(err => {
        console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

}

