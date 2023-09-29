'use strict';

const { promisify } = require('util');
const client = require('../databases/init.redis');

// const REDIS_GET = promisify(client.get).bind(client);
// const REDIS_SET = promisify(client.set).bind(client);
// const REDIS_LRANGE = promisify(client.lRange).bind(client);

// module.exports = {
//     REDIS_GET,
//     REDIS_SET,
//     REDIS_LRANGE,
// };

module.exports = {
    redisSet: async (key, value, options) => {
        try {
            return await client.set(key, value, options);
        } catch (error) {
            throw error;
        };
    },
    redisGet: async (key) => {
        try {
            return await client.get(key);
        } catch (error) {
            throw error;
        };
    },
};
