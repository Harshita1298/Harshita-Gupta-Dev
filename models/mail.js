require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            securet: true,
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
             logger: true,    // Debug Logs दिखाएगा
    debug: true      // Debug Mode Enable
        });

        // Email Options
        const mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: text
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent: ", info.response);
        return { success: true, message: "Email Sent Successfully!" };
    } catch (error) {
        console.error("🚨 Email Error: ", error);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;
