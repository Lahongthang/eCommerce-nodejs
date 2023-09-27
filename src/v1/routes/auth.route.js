const express = require('express');
const { register, verifyOtp } = require('../controllers/auth.controller');

const routes = express.Router();

routes.post('/register', register);
routes.post('/verifyOtp', verifyOtp);

module.exports = routes;
