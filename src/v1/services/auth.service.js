'use strict';

const _User = require('../models/user.model');
const { insertOtp } = require('../services/otp.service');
const { generateOtp } = require('../utils/generateOtp');
const { transportEmail } = require('../utils/transportEmail');

module.exports = {
    register: async (data) => {
        try {
            const { username, email } = data;
            
            const existedUsername = await _User.findOne({
                username: { $regex: new RegExp(username, 'i') }
            });
            if (existedUsername) return {
                code: 422,
                message: 'User name existed!',
            };

            const existedEmail = await _User.findOne({
                email: { $regex: new RegExp(email, 'i') }
            });
            if (existedEmail) return {
                code: 422,
                message: 'Email existed!',
            };

            const otp = generateOtp(6);

            await insertOtp({otp, email});

            await transportEmail(email, 'EMAIL VERIFICATION', `Your otp is:\n${otp}`);

            return {
                code: 200,
                message: 'Sent otp success!',
                elements: 1,
            };
        } catch (error) {
            throw error;
        };
    },
};
