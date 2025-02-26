require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const Contact = require('./models/Contact'); // Contact Model import करें

// Express app initialize
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/contact_form', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected...");
}).catch(err => console.log(err));

// POST route to handle form submission
app.post('/submit-form', async (req, res) => {
    const { fullName, email, phone, subject, message } = req.body;

    // Save data to MongoDB
    const newContact = new Contact({
        fullName,
        email,
        phone,
        subject,
        message
    });

    try {
        await newContact.save();

        // Send Confirmation Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Thank You for Contacting Us - ${subject}`,
            text: `Hello ${fullName},\n\nThank you for reaching out! We will get back to you soon.\n\nYour Message:\n${message}\n\nBest Regards,\nYour Company`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error while sending email');
            }
            res.status(200).send('Message received & Email sent successfully!');
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving contact details');
    }
});

// Contact Form Data को Database में Store करने का API Route
app.post('/contact', async (req, res) => {
    try {
        const { fullName, email, phone, subject, message } = req.body;
        const newContact = new Contact({ fullName, email, phone, subject, message });
        await newContact.save();
        res.status(201).json({ success: true, message: 'Message Sent Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
