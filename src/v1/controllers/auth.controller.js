'use strict';

const { register, verifyOtp, login, refreshToken } = require('../services/auth.service');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { code, message, elements } = await register(req.body);
            res.status(code).json({ code, message, elements });
        } catch (error) {
            console.error(error);
            next(error);
        };
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { code, message, elements } = await verifyOtp(req.body);
            res.status(code).json({ code, message, elements });
        } catch (error) {
            next(error);
        };
    },
    login: async (req, res, next) => {
        try {
            const { code, message, elements } = await login(req.body);
            return res.status(code).json({ code, message, elements });
        } catch (error) {
            next(error);
        };
    },
    refreshToken: async (req, res, next) => {
        try {
            const { code, message, elements } = await refreshToken(req.body);
            return res.status(code).json({ code, message, elements });
        } catch (error) {
            next(error);
        };
    },
};
