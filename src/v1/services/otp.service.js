'use strict';

const _Otp = require('../models/otp.model');

module.exports = {
    insertOtp: async (data) => {
        try {
            const { otp, email } = data;
            const newOtp = new _Otp({ otp, email });
            await newOtp.save();
        } catch (error) {
            throw error;
        };
    },
};
