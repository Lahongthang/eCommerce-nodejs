const nodeMailer = require('nodemailer');
const { SYSTEM } = require('../configs/app');

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    host: 'smtp.forwardemail.net',
    port: 465,
    secure: true,
    auth: {
        user: SYSTEM.MAIL,
        pass: SYSTEM.PASSWORD,
    },
});

const transportEmail = async (receiver, subject, text) => {
    try {
        await transporter.sendMail({
            from: SYSTEM.NAME,
            to: receiver,
            subject,
            text,
        })
    } catch (error) {
        throw error;
    };
};

module.exports = {
    transportEmail,
};
