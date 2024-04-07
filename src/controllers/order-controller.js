'use strict';

const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async (request, response, next) => {
    try {
        var data = await repository.get();
        response.status(200).send(data);
    } catch (e) {
        response.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async (request, response, next) => {
    try {
        const token = request.body.token || request.query.token || request.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: request.body.items
        });
        response.status(201).send({ message: 'Pedido cadastrado com sucesso!' });
    } catch (e) {
        response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};