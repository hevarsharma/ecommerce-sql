const mySql = require('mysql');

module.exports = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce_application_sql',
});