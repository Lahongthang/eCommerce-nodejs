const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ACCESS_TOKEN_SECRET } = require('../configs/app');

const signAccessToken = (userId) => {
    const payload = { userId };
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: 30,
    };

    return jwt.sign(payload, secret, options);
};

const signRefreshToken = (userId) => {
    const payload = { userId };
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: '1y',
    };

    return jwt.sign(payload, secret, options);
};

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return next(createError.Unauthorized('Access denied!'));

    const token = authHeader.split(' ')[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            console.log('err::: ', err)
            const errMsg = err.name === 'TokenExpiredError' ? 'Token expired!' : 'Invalid token!';
            return next(createError.Unauthorized(errMsg));
        };
        req.payload = payload;
        next();
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
};