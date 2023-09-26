'use strict';

// const { setPromise, getPromise } = require('../services/redis.service');
const { REDIS_GET, REDIS_SET } = require('../services/redis.service');

module.exports = {
    setPromise: async (req, res, next) => {
        try {
            const { key, payload } = req.body;
            const data = await REDIS_SET({ key, value: JSON.stringify(payload) });
            return res.json({
                data,
            });
        } catch (error) {
            next(error);
        };
    },
    getPromise: async (req, res, next) => {
        try {
            const { key } = req.body;
            const data = await REDIS_GET(key);
            return res.json({
                data: JSON.parse(data),
            });
        } catch (error) {
            next(error);
        };
    },
};
