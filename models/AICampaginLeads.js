// campaigns_leads.model.js
const mongoose = require('mongoose');

const aiCampaignLeadsSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true,
        index: true // Add index for faster queries
    },
    campaignUid: {
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
    callDuration: {
        type: String,
        required: false,
    },
    lastContactAttempt: {
        type: Date,
        required: false,
        default: null
    },
    attempts: {
        type: Number,
        default: 0,
        required: false,
    },
    conversationHistory: {
        type: Array,
        required: false,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
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
aiCampaignLeadsSchema.index({ campaignUid: 1, status: 1 });
aiCampaignLeadsSchema.index({ organizationId: 1, campaignUid: 1 });

const AICampaignLeads = mongoose.model('AICampaignLeads', aiCampaignLeadsSchema);
module.exports = AICampaignLeads;