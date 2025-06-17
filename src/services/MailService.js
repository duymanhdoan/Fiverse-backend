var nodemailer = require('nodemailer');
require('dotenv').config()

/*
    gửi mail, input bao gồm thông tin url frontend để redirect
*/
const transport = (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL,
        to: req.email,
        subject: 'test',
        text: `${process.env.SERVER_DOMAIN}${req.path}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send("email sent successfully!");
        }
    });
};

module.exports.transport = transport;




