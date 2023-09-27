module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URI: process.env.REDIS_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SYSTEM: {
        MAIL: process.env.SYSTEM_MAIL,
        NAME: process.env.SYSTEM_NAME,
        PASSWORD: process.env.SYSTEM_PASSWORD,
    },
};
