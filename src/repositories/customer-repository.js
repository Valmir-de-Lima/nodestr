'use strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save();
}

exports.authenticate = async (data) => {
    const response = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return response;
}

exports.getById = async (id) => {
    const response = await Customer.findById(id);
    return response;
}