const nodemailer = require('nodemailer');

function sendEmail(recipient, subject, body) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reviewsyncinc@gmail.com\n',
            pass: 'TestEmail123' // Your email password
        }
    });

    // Setup email data
    let mailOptions = {
        from: '"Your Name" <your-email@gmail.com>', // Sender address
        to: recipient, // List of receivers
        subject: subject, // Subject line
        text: body, // Plain text body
        html: `<b>${body}</b>` // HTML body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = sendEmail;
