const Joi = require('joi');
const { createValidationError } = require('../../utils/createValidationError');

const loginValidation = (req, res, next) => {
    const rule = Joi.object({
        username: Joi.string().required().messages({
            'string.empty': 'User name is not allowed to be empty',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is not allowed to be empty',
        }),
    });

    const { error } = rule.validate(req.body);

    if (error) {
        return res.status(422).json({
            code: 422,
            error: createValidationError(error.details),
        });
    };

    next();
};

module.exports = {
    loginValidation,
};
