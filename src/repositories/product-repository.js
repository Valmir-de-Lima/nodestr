'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    const response = await Product.find({
        active: true
    }, 'title price slug');
    return response;
}

exports.getBySlug = async (slug) => {
    const response = await Product.findOne({
        slug: slug,
        active: true
    }, 'title description price slug tags');
    return response;
};

exports.getById = async (id) => {
    const response = await Product.findById(id);
    return response;
};

exports.getByTag = async (tags) => {
    const response = await Product.find({
        tags: tags,
        active: true
    }, 'title description price slug tags');
    return response;
};

exports.create = async (data) => {
    await new Product(data).save();
};

exports.update = async (id, data) => {
    await Product.findByIdAndUpdate(id,
        {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
};

exports.delete = async (id) => {
    await Product.findByIdAndDelete(id);
};




