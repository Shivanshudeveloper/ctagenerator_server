const mongoose = require('mongoose');

const LinkedInInvitationsSchema = new mongoose.Schema({
    invitationId: {
        type: String,
        required: false,
    },
    accountId: {
        type: String,
        required: false,
    },
    provider_id: {
        type: String,
        required: false,
    },
    organizationId: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    agentUid: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const linkedinInvitations = mongoose.model('linkedinInvitations', LinkedInInvitationsSchema);
module.exports = linkedinInvitations;
