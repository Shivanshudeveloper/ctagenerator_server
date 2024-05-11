const mongoose = require('mongoose');

const emailSendSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: false,
    },
    client_email: {
        type: String,
        required: false,
    },
    email_body: {
        type: String,
        required: false,
    },
    email_subject: {
        type: String,
        required: false,
    },
    email_send_to: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const EmailSend = mongoose.model('emails_send', emailSendSchema);
module.exports = EmailSend;
