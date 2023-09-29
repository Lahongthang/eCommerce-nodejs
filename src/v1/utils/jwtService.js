const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../configs/app');

const signAccessToken = (userId) => {
    const payload = { userId };
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: 30,
    };

    const token = jwt.sign(payload, secret, options);
    return token;
};

const signRefreshToken = (userId) => {
    const payload = { userId };
    const secret = REFRESH_TOKEN_SECRET;
    const options = {
        expiresIn: '1y',
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

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) throw createError.Unauthorized();
        return payload;
    });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
