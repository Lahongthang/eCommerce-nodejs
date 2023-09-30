const Joi = require('joi');
const { createValidationError } = require('../../utils/createValidationError');

const registerValidation = (req, res, next) => {
    const rule = Joi.object({
        username: Joi.string().required().min(4).max(24).messages({
            'string.empty': 'User name is not allowed to be empty',
            'string.min': 'User name must be at least 4 characters',
            'string.max': 'User name must be less than or equal to 24 characters',
        }),
        email: Joi.string().required().email().messages({
            'string.empty': 'Email is not allowed to be empty',
            'string.email': 'Email address must be a valid email',
        }),
        password: Joi.string().required().min(8).messages({
            'string.empty': 'Password is not allowed to be empty',
            'string.min': 'Password must be at least 8 characters',
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

const verifyOtpValidation = (req, res, next) => {
    const rule = Joi.object({
        username: Joi.string().required().min(4).max(24).messages({
            'string.empty': 'User name is not allowed to be empty',
            'string.min': 'User name must be at least 4 characters',
            'string.max': 'User name must be less than or equal to 24 characters',
        }),
        email: Joi.string().required().email().messages({
            'string.empty': 'Email is not allowed to be empty',
            'string.email': 'Email address must be a valid email',
        }),
        password: Joi.string().required().min(8).messages({
            'string.empty': 'Password is not allowed to be empty',
            'string.min': 'Password must be at least 8 characters',
        }),
        otp: Joi.string().required().length(6).messages({
            'string.empty': 'Otp is not allowed to be empty',
            'string.length': 'Otp must be 6 characters',
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
    registerValidation,
    verifyOtpValidation,
};
