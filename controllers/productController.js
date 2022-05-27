const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    let categoryArray = [];
    let filteredProductArray = [];
    let mainFilterProductArray = []
    try{
    Product.find()
        .then(products => {
            products.filter(function (product) {
                if (categoryArray.indexOf(product.category) === -1) {
                    categoryArray.push(product.category);
                }
            })/// first filter out category and push them in list categoryArray.......
            categoryArray.forEach(element => {
                filteredProductArray.push(products.filter(function (product) {
                    return product.category == element;
                })
                )
            }); /// compare categorywise the product array and push them into filteredProductArray so that we can take 5-5 elements from it.
            return filteredProductArray;
        })
        .then(array => {
            array.forEach( filterdList => {
                mainFilterProductArray.push(filterdList.slice(0,2));
            })   //now here we are taking range of 5 element of filteredProductArray and pushing into mainFilterProductArray for response...
            return res.send(mainFilterProductArray)
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
    catch(err){
        console.log(err);
    }
};

exports.getProductsByCategory = (req, res, next) => {
    const prodCategory = req.params.category;
    Product.find()
        .then(products => {
            let productsByCategory = products.filter(function(product) {
                return product.category == prodCategory;
              });
            res.send(productsByCategory);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProductById = (req, res, next) => {
    console.log(req);
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId)
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