'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./src/config');

const app = express();

// Conecta ao banco de dados
mongoose.connect(config.connectionString);

// Carrega os Models
const Product = require('./src/models/product');
const Customer = require('./src/models/customer');
const Order = require('./src/models/order');

// Carrega as Rotas
const indexRoute = require('./src/routes/index-route');
const productRoute = require('./src/routes/product-route');
const customerRoute = require('./src/routes/customer-route');
const orderRoute = require('./src/routes/order-route');

// Estabelece como padrão a converção do JSON nos controllers com o limite de 5 megabyte
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));

// Habilita o CORS
app.use(function (req, res, next) {
    // Liberamos quais api's que podem acessar a nossa api
    res.header('Access-Control-Allow-Origin', '*');
    // Liberamos os hearders que podem compor uma requisicao para a nossa api
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    // Liberamos quais métodos http que uma requisicao pode ter ao acessar a nossa api
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);

module.exports = app;
