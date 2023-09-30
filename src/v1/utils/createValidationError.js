const createValidationError = (errors) => {
    return errors.reduce((result, curr) => {
        const key = curr.context.key;
        const message = curr.message;
        return { ...result, [key]: message };
    }, {})
}

module.exports = {
    createValidationError,
};
