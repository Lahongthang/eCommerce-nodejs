'use strict';

const { register, verifyOtp, login, refreshToken } = require('../services/auth.service');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { code, error, message } = await register(req.body);
            res.status(code).json({ code, error, message });
        } catch (error) {
            console.error(error);
            next(error);
        };
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { code, error, message, elements } = await verifyOtp(req.body);
            res.status(code).json({ code, error, message, elements });
        } catch (error) {
            next(error);
        };
    },
    login: async (req, res, next) => {
        try {
            const { code, error, message, elements } = await login(req.body);
            return res.status(code).json({ code, error, message, elements });
        } catch (error) {
            next(error);
        };
    },
    refreshToken: async (req, res, next) => {
        try {
            const { code, error, message, elements } = await refreshToken(req.body);
            return res.status(code).json({ code, error, message, elements });
        } catch (error) {
            next(error);
        };
    },
};
