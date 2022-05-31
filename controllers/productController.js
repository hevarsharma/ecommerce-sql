const mySqlConnection = require('../config/dbConfig');

exports.getProducts = (req, res, next) => {
    let categoryArray = [];
    let filteredProductArray = [];
    let mainFilterProductArray = []

    try {

        mySqlConnection.query("SELECT * FROM products", async (err, products, field) => {

            await products.filter(function (product) {
                if (categoryArray.indexOf(product.category) === -1) {
                    categoryArray.push(product.category);
                }

            })/// first filter out category and push them in list categoryArray.......
            categoryArray.forEach(element => {
                filteredProductArray.push(products.filter(function (product) {
                    return product.category == element;
                })
                );
            }); /// compare categorywise the product array and push them into filteredProductArray so that we can take 5-5 elements from it.

            filteredProductArray.forEach(filterdList => {
                mainFilterProductArray.push(filterdList.slice(0, 2));
            })
            return res.send({
                'code': 200,
                products: mainFilterProductArray
            })

        })

    } catch (err) {
        res.send({
            'code': 200,
            er: err
        })
    }

};

exports.getProductsByCategory = (req, res, next) => {
    const prodCategory = req.params.category;
    try {
        mySqlConnection.query("SELECT * FROM products", async (err, products, field) => {
            let productsByCategory = products.filter(function (product) {
                return product.category == prodCategory;
            });

            if (productsByCategory.length !== 0) {
                res.send({
                    'code': 200,
                    productsByCategory: productsByCategory
                });
            }
            else {
                res.send({
                    'code': 204,
                    message: "Category is not defined..."
                });
            }

        });
    } catch (err) {
        res.send({
            'code': 204,
            er: err
        });
    }

}

exports.getProductById = (req, res, next) => {
    const prodId = req.params.productId.trim();

    mySqlConnection.query(`SELECT * FROM products WHERE id = ${prodId}`, async (err, product, field) => {
        try {
            if (product.length !== 0) {
                res.send({
                    'code': 200,
                    product: product[0]
                });
            }
            else {
                res.send({
                    'code': 204,
                    err: "Product is not find..."
                });
            }
        } catch (err) {
            res.send({
                'code': 204,
                er: "err"
            });
        }

    })
};