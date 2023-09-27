const express = require('express');
const { register, verifyOtp, login } = require('../controllers/auth.controller');

const routes = express.Router();

routes.post('/register', register);
routes.post('/verifyOtp', verifyOtp);
routes.post('/login', login);

module.exports = routes;
