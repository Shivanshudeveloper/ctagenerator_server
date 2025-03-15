const mongoose = require('mongoose');

const emailSendingDomainsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    organizationId: {
        type: String,
        required: false
    },
    listName: {
        type: String,
        required: false
    },
    mailBox: {
        type: String,
        required: false
    },
    mailBoxConfig: {
        type: Object,
        required: false
    },
    mailBoxType: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const emailsendingmailbox = mongoose.model('emailsendingmailbox', emailSendingDomainsSchema);
module.exports = emailsendingmailbox;