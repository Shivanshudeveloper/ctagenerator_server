const mongoose = require('mongoose');

const aiCampaginsSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    campaignUid: {
        type: String,
        required: true,
    },
    aiAgentUid: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    listName: {
        type: String,
        required: false,
    },
    phoneNumbers: {
        type: Array,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const aicampagins = mongoose.model('aicampagins', aiCampaginsSchema);
module.exports = aicampagins;
