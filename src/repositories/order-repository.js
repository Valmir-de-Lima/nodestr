'use strict';
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async (data) => {
    var response = await Order
        .find({}, 'number status customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
    return response;
}

exports.create = async (data) => {
    var order = new Order(data);
    await order.save();
}