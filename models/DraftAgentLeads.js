// campaigns_leads.model.js
const mongoose = require('mongoose');

const draftAgentSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true,
        index: true // Add index for faster queries
    },
    aiAgentUid: {
        type: String,
        required: true,
        index: true
    },
    listName: {
        type: String,
        required: true,
        index: true
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'leadlistsData',
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    emailSend: {
        type: String,
        required: false,
    },
    emailSendData: {
        type: Object,
        required: false,
    },
    dmContent: {
        type: String,
        required: false,
    },
    dmSend: {
        type: String,
        required: false,
    },
    dmSendData: {
        type: Object,
        required: false,
    },
    dmStatus: {
        type: String,
        default: 'pending',
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Add compound indexes for common queries
draftAgentSchema.index({ campaignUid: 1, status: 1 });
draftAgentSchema.index({ organizationId: 1, campaignUid: 1 });

const draftAgentLeads = mongoose.model('draftAgentLeads', draftAgentSchema);
module.exports = draftAgentLeads;