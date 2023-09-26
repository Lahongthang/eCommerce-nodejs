const { createClient } = require('redis');
const { REDIS_URI } = require('../configs/app');

const client = createClient({
    url: REDIS_URI,
});

client.on('connect', () => {
    console.log('Redis client connect success!');
});

client.on('error', (err) => {
    console.error('Err::: ', err);
});

client.connect()
    .then(() =>
        client.ping()
            .then((rs) => console.log(rs)))
            .catch((err) => console.log(err))
    .catch((error) => console.log('Redis error: ', error));

module.exports = client;
