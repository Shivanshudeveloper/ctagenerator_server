const mongoose = require('mongoose');

const LinkedInMessagesSchema = new mongoose.Schema({
    object: {
        type: String,
        required: false,
    },
    chat_id: {
        type: String,
        required: false,
    },
    message_id: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    accountId: {
        type: String,
        required: false,
    },
    attendees_ids: {
        type: String,
        required: false,
    },
    organizationId: {
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

const linkedinMessages = mongoose.model('linkedinMessages', LinkedInMessagesSchema);
module.exports = linkedinMessages;
