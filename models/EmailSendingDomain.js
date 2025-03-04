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
    domainName: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
        default: 'not_started'
    },
    records: {
        type: Array,
        required: false,
    },
    resendDomainId: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const emailsendingdomain = mongoose.model('emailsendingdomain', emailSendingDomainsSchema);
module.exports = emailsendingdomain;