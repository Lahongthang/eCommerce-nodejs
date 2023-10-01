const express = require('express');
const { register, verifyOtp, login, refreshToken, logout } = require('../controllers/auth.controller');
const { registerValidation, verifyOtpValidation } = require('../middlewares/validations/register.validation');
const { loginValidation } = require('../middlewares/validations/login.validation');

const routes = express.Router();

routes.post('/register', registerValidation, register);
routes.post('/verifyOtp', verifyOtpValidation, verifyOtp);
routes.post('/login', loginValidation, login);
routes.put('/refreshToken', refreshToken);
routes.delete('/logout', logout);

module.exports = routes;
