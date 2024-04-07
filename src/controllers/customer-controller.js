'use strict';

const ValidationContract = require('../validators/flunt-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.post = async (request, response, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(request.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(request.body.email, 'E-mail inválido');
    contract.hasMinLen(request.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        response.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: request.body.name,
            email: request.body.email,
            password: md5(request.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(
            request.body.email,
            'Bem vindo ao Node Store',
            global.EMAIL_TMPL.replace('{0}', request.body.name));

        response.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(200).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(200).send({
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};