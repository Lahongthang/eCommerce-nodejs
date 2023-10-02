const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const _User = require('../models/user.model');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EX_TIME, REFRESH_TOKEN_EX_TIME } = require('../configs/app');

const signAccessToken = (userId) => {
    const payload = { userId };
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: ACCESS_TOKEN_EX_TIME,
    };

    const token = jwt.sign(payload, secret, options);
    return token;
};

const signRefreshToken = (userId) => {
    const payload = { userId };
    const secret = REFRESH_TOKEN_SECRET;
    const options = {
        expiresIn: REFRESH_TOKEN_EX_TIME,
    };

    const token = jwt.sign(payload, secret, options);
    return token;
};

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return next(createError.Unauthorized('Access denied!'));

    const token = authHeader.split(' ')[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const errMsg = err.name === 'TokenExpiredError' ? 'Token expired!' : 'Invalid token!';
            return next(createError.Unauthorized(errMsg));
        };
        req.payload = payload;
        next();
    });
};

const userGuard = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return next(createError.Unauthorized('Access denied!'));

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const errMsg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
                return next(createError.Unauthorized(errMsg));
            };
            return payload;
        });

        const user = await _User.findOne({ _id: payload?.userId });

        if (!user) return next(createError.Unauthorized('Access denied'));

        next();
    } catch (error) {
        throw error;
    };
};

const adminGuard = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return next(createError.Unauthorized('Access denied!'));

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const errMsg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
                return next(createError.Unauthorized(errMsg));
            };
            return payload;
        });

        const user = await _User.findOne({ _id: payload?.userId });

        if (!user) return next(createError.Unauthorized('Access denied'));

        if (!user?.isAdmin) return next(createError.Forbidden('Permission denied'));

        next();
    } catch (error) {
        throw error;
    };
};

const verifyRefreshToken = (refreshToken) => {
    if (!refreshToken) throw createError.Unauthorized('Access denied!');
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const errMsg = err.name === 'TokenExpiredError' ? 'Token expired!' : 'Invalid token!';
            throw createError.Unauthorized(errMsg);
        }
        return payload;
    });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    userGuard,
    adminGuard,
};
