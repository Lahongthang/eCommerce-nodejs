const express = require('express');
const createError = require('http-errors');
const { v4: uuid } = require('uuid');
const { logErrors } = require('../utils/logErrors');

const routes = express.Router();

routes.use('/checkStatus', (req, res, next) => {
    res.send({
        code: 200,
        message: 'Api ok!',
    });
});

routes.use('/api/v1/auth', require('./auth.route'));
routes.use('/api/v1/users', require('./user.route'));

routes.use((req, res, next) => {
    next(createError.NotFound());
});

routes.use((err, req, res, next) => {
    logErrors(uuid(), req.url, req.method, err.message);
    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message,
    });
});

module.exports = routes;