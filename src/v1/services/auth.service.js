'use strict';

const { isEmpty } = require('lodash');
const _User = require('../models/user.model');
const _Otp = require('../models/otp.model');
const { eCommerceDb } = require('../databases/init.mongodb');
const { insertOtp } = require('../services/otp.service');
const { redisSet, redisGet, redisDelete } = require('../services/redis.service');
const { REFRESH_TOKEN_EX_TIME, ACCESS_TOKEN_EX_TIME } = require('../configs/app');
const { generateOtp } = require('../utils/otpGenerator');
const { transportEmail } = require('../utils/transportEmail');
const { isValidCode } = require('../utils/hashCode');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwtService');

module.exports = {
    register: async (data) => {
        try {
            const { username, email } = data;
            
            const existedUsername = await _User.findOne({
                username: { $regex: new RegExp(username, 'i') }
            });
            if (existedUsername) return {
                code: 422,
                error: {
                    username: 'User name is existed',
                },
            };

            const existedEmail = await _User.findOne({
                email: { $regex: new RegExp(email, 'i') }
            });
            if (existedEmail) return {
                code: 422,
                error: {
                    email: 'Email is existed',
                },
            };

            const otp = generateOtp(6);

            await insertOtp({otp, email});

            await transportEmail(email, 'EMAIL VERIFICATION', `Your otp is:\n${otp}`);

            return {
                code: 200,
                message: 'Sent otp success!',
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
                error: {
                    otp: 'Expired otp',
                },
            };

            const lastOtp = otpHolder[otpHolder.length - 1]

            const isValidOtp = await isValidCode(otp, lastOtp.otp);

            if (!isValidOtp ) return {
                code: 422,
                error: {
                    otp: 'Invalid otp',
                },
            };

            if (isValidOtp && email === lastOtp.email) {
                const existedUsername = await _User.findOne({
                    username: { $regex: new RegExp(username, 'i') }
                });
                if (existedUsername) return {
                    code: 422,
                    error: {
                        username: 'User name is existed',
                    },
                };

                const existedEmail = await _User.findOne({
                    email: { $regex: new RegExp(email, 'i') }
                });
                if (existedEmail) return {
                    code: 422,
                    error: {
                        email: 'Email is existed',
                    },
                };

                session.startTransaction();

                const newUser = new _User({
                    username,
                    email,
                    password,
                });

                const createdUser = await newUser.save();

                if (createdUser) {
                    await _Otp.deleteMany({ email });
                    
                    await session.commitTransaction();
                    session.endSession();

                    return {
                        code: 201,
                        message: 'Verify otp success',
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

                    await redisSet(user._id.toString(), refreshToken, { EX: REFRESH_TOKEN_EX_TIME });

                    return {
                        code: 200,
                        message: 'Login success',
                        elements: {
                            user,
                            accessToken: {
                                value: accessToken,
                                expiresAt: Date.now() + ACCESS_TOKEN_EX_TIME * 1000,
                            },
                            refreshToken: {
                                value: refreshToken,
                                expiresAt: Date.now() + REFRESH_TOKEN_EX_TIME * 1000,
                            },
                        },
                    };
                };
            };

            return {
                code: 422,
                error: {
                    username: 'User name or password is incorrect',
                    password: 'User name or password is incorrect',
                },
            };
        } catch (error) {
            throw error;
        };
    },
    refreshToken: async (data) => {
        try {
            const { refreshToken } = data;
            const { userId } = verifyRefreshToken(refreshToken);

            const existedToken = await redisGet(userId.toString());
            if (existedToken !== refreshToken) return {
                code: 401,
                error: {
                    refreshToken: 'Refresh token expired',
                },
            };

            const newAccessToken = signAccessToken(userId);

            return {
                code: 200,
                message: 'Refresh token success',
                elements: {
                    accessToken: newAccessToken,
                },
            };
        } catch (error) {
            throw error;
        };
    },
    logout: async (data) => {
        try {
            const { refreshToken } = data;
            const { userId } = verifyRefreshToken(refreshToken);

            const existedToken = await redisGet(userId.toString());
            if (existedToken !== refreshToken) return {
                code: 401,
                error: {
                    refreshToken: 'Refresh token expired',
                },
            };

            await redisDelete(userId);

            return {
                code: 200,
                message: 'Logout success',
            };
        } catch (error) {
            throw error;
        };
    },
};
