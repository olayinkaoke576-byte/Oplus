const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email Configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Endpoint to handle quote submissions
app.post('/api/quote', (req, res) => {
    const newQuote = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...req.body
    };

    const quotesFile = path.join(__dirname, 'quotes.json');

    // Read existing quotes
    fs.readFile(quotesFile, 'utf8', (err, data) => {
        let quotes = [];
        if (!err && data) {
            try {
                quotes = JSON.parse(data);
            } catch (e) {
                console.error('Error parsing quotes JSON:', e);
            }
        }

        // Add new quote
        quotes.push(newQuote);

        // Save back to file
        fs.writeFile(quotesFile, JSON.stringify(quotes, null, 2), (err) => {
            if (err) {
                console.error('Error saving quote:', err);
                return res.status(500).json({ success: false, message: 'Failed to save quote' });
            }

            console.log('New quote received:', newQuote);

            // Send Email Notification
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'oplusaluminium@gmail.com',
                subject: 'New Quote Request - Oplus Aluminium',
                html: `
                    <h2>New Quote Request</h2>
                    <p><strong>Name:</strong> ${newQuote.name}</p>
                    <p><strong>Phone:</strong> ${newQuote.phone}</p>
                    <p><strong>Email:</strong> ${newQuote.email}</p>
                    <p><strong>Project Details:</strong></p>
                    <p>${newQuote.project}</p>
                    <p><em>Received via Website Form</em></p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                    // We still return success to the client because the quote was saved
                    return res.status(200).json({
                        success: true,
                        message: 'Quote received successfully (Email notification failed)'
                    });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ success: true, message: 'Quote received successfully' });
                }
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
