const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    product: { type: Object, required: true },

    user: { type: Object, required: true },
    
});

module.exports = mongoose.model('Order', orderSchema);
