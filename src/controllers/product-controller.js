'use strict';

const ValidationContract = require('../validators/flunt-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async (request, response, next) => {
    try {
        var data = await repository.get();
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send({ message: 'Falha ao recuperar os produtos', data: error });
    }
};

exports.getBySlug = async (request, response, next) => {
    try {
        var data = await repository.getBySlug(request.params.slug);
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send({ message: 'Falha ao recuperar o produto', data: error });
    }
};

exports.getById = async (request, response, next) => {
    try {
        var data = await repository.getById(request.params.id);
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send({ message: 'Falha ao recuperar o produto', data: error });
    }
};

exports.getByTag = async (request, response, next) => {
    try {
        var data = await repository.getByTag(request.params.tag);
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send({ message: 'Falha ao recuperar o produto', data: error });
    }
};

exports.post = async (request, response, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(request.body.title, 3, "O título deve conter pelo menos 3 caracteres");
    contract.hasMinLen(request.body.slug, 3, "O slug deve conter pelo menos 3 caracteres");
    contract.hasMinLen(request.body.description, 3, "A descrição deve conter pelo menos 3 caracteres");

    if (!contract.isValid()) {
        response.status(400).send(contract.errors()).end();
        return;
    }

    try {
        // // Cria o Blob Service
        // const blobSrv = azure.createBlobService(config.containerConnectionString);

        // //Prepara o arquivo que receberá a imagem
        // let filename = guid.raw().toString() + '.jpg';
        // let rawdata = request.body.image;
        // let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // let type = matches[1];
        // let buffer = new Buffer(matches[2], 'base64');

        // // Salva a imagem no Azure
        // await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
        //     contentType: type
        // }, function (error, result, response) {
        //     if (error) {
        //         filename = 'default-product.png'
        //     }
        // });

        await repository.create({
            title: request.body.title,
            slug: request.body.slug,
            description: request.body.description,
            price: request.body.price,
            active: true,
            tags: request.body.tags,
            //image: 'https://nodestr.blob.core.windows.net/product-images/' + filename
            image: request.body.image
        });

        response.status(201).send({ message: 'Producto cadastrado com sucesso' });
    } catch (error) {
        response.status(400).send({ message: 'Falha ao cadastrar o produto', data: error });
    }
};

exports.put = async (request, response, next) => {
    try {
        await repository.update(request.params.id, request.body);
        response.status(200).send({ message: 'Producto atualizado com sucesso' });
    } catch (error) {
        response.status(400).send({ message: 'Falha ao atualizar o produto', data: error });
    }
};

exports.delete = async (request, response, next) => {
    try {
        await repository.delete(request.body.id);
        response.status(200).send({ message: 'Producto excluído com sucesso' });
    } catch (error) {
        response.status(400).send({ message: 'Falha ao excluir o produto', data: error });
    }
};

