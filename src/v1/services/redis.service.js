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
    REDIS_SET: async ({ key, value }) => {
        try {
            return await client.set(key, value);
        } catch (error) {
            throw error;
        };
    },
    REDIS_GET: async (key) => {
        try {
            return await client.get(key);
        } catch (error) {
            throw error;
        };
    },
};
