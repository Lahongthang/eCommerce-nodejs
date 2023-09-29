const { Schema } = require('mongoose');
const { eCommerceDb } = require('../databases/init.mongodb');
const { generateHashCode } = require('../utils/hashCode');
const { ACCESS_TOKEN_EX_TIME } = require('../configs/app');

const OtpSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    time: { type: Date, required: true, default: Date.now, index: { expires: ACCESS_TOKEN_EX_TIME } },
}, {
    collection: 'otps',
});

OtpSchema.pre('save', async function(next) {
    try {
        const hashOtp = await generateHashCode(this.otp);
        this.otp = hashOtp;
        next();
    } catch (error) {
        next(error);
    };
});

module.exports = eCommerceDb.model('otps', OtpSchema);
