const otpGenerator = require('otp-generator');

const generateOtp = (
    length, digits = true,
    specialChars = false,
    upperCaseAlphabets = false,
    lowerCaseAlphabets = false,
) => {
    const otp = otpGenerator.generate(length, {
        digits,
        specialChars,
        upperCaseAlphabets,
        lowerCaseAlphabets,
    });
    return otp;
};

module.exports = {
    generateOtp,
};
