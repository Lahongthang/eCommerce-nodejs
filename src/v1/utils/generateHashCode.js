const bcrypt = require('bcrypt');

const generateHashCode = async (code, round = 10) => {
    try {
        const salt = await bcrypt.genSalt(round);
        const hashCode = await bcrypt.hash(code, salt);
        return hashCode;
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const isValidCode = async (code, hashCode) => {
    try {
        return await bcrypt.compare(code, hashCode);
    } catch (error) {
        throw error;
    };
};

module.exports = {
    generateHashCode,
    isValidCode,
};
