const mongoose = require('mongoose');

const draftAiAgentSettingsSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: false
    },
    linkedInUrl: {
        type: String,
        required: false
    },
    prospectName: {
        type: String,
        required: false
    },
    aiModel: {
        type: String,
        required: false
    },
    prospectTitle: {
        type: String,
        required: false
    },
    prospectCompany: {
        type: String,
        required: false
    },
    prospectLocation: {
        type: String,
        required: false
    },
    productDescription: {
        type: String,
        required: false
    },
    gptPrompt: {
        type: String,
        required: false
    },
    agentType: {
        type: String,
        required: false
    },
    agentObjectId: {
        type: String,
        required: false
    },
    aiAgentUid: {
        type: String,
        required: false
    },
    wordLength: {
        type: Number,
        required: false
    },
    emailTone: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false
    },
    webhook: {
        type: String,
        required: false
    },
    webhookEnable: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const draftaiagentsettings = mongoose.model('draftaiagentsettings', draftAiAgentSettingsSchema);
module.exports = draftaiagentsettings;