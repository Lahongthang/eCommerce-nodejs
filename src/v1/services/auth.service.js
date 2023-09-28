'use strict';

const { isEmpty } = require('lodash');
const _User = require('../models/user.model');
const _Otp = require('../models/otp.model');
const { eCommerceDb } = require('../databases/init.mongodb');
const { insertOtp } = require('../services/otp.service');
const { generateOtp } = require('../utils/otpGenerator');
const { transportEmail } = require('../utils/transportEmail');
const { isValidCode } = require('../utils/hashCode');
const { signAccessToken, signRefreshToken } = require('../utils/jwtService');

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
    verifyOtp: async (data) => {
        const session = await eCommerceDb.startSession();
        try {
            const { otp, email, username, password } = data;
            const otpHolder = await _Otp.find({
                email: { $regex: new RegExp(email, 'i') }
            });
            
            if (isEmpty(otpHolder)) return {
                code: 422,
                message: 'Expired otp!',
            };

            const lastOtp = otpHolder[otpHolder.length - 1]

            const isValidOtp = await isValidCode(otp, lastOtp.otp);

            if (!isValidOtp ) return {
                code: 422,
                message: 'Invalid otp!',
            };

            if (isValidOtp && email === lastOtp.email) {
                const existedUser = await _User.findOne({
                    $or: [
                        { email: { $regex: new RegExp(email, 'i') } },
                        { username: { $regex: new RegExp(username, 'i') } },
                    ]
                })

                if (existedUser) return {
                    code: 422,
                    message: 'User existed!',
                };

                session.startTransaction();

                const newUser = new _User({
                    username,
                    email,
                    password,
                });

                const createdUser = await newUser.save({session});

                if (createdUser) {
                    await _Otp.deleteMany({ email });
                    
                    await session.commitTransaction();
                    session.endSession();

                    return {
                        code: 201,
                        elements: createdUser,
                    };
                };
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        };
    },
    login: async (data) => {
        try {
            const { username, password } = data;
            const user = await _User.findOne({
                $or: [
                    { username: { $regex: new RegExp(username, 'i') } },
                    { email: { $regex: new RegExp(username, 'i') } },
                ]
            });

            if (user) {
                const isValidPassword = await isValidCode(password, user.password);
                if (isValidPassword) {
                    const accessToken = signAccessToken(user._id);
                    const refreshToken = signRefreshToken(user._id);
                    return {
                        code: 200,
                        message: 'Login success!',
                        elements: {
                            user,
                            accessToken,
                            refreshToken,
                        },
                    };
                };
            };

            return {
                code: 422,
                message: 'User name or password is incorrect!',
            };
        } catch (error) {
            throw error;
        };
    },
};
