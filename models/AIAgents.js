const mongoose = require('mongoose');

const aiAgentsSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    aiAgentUid: {
        type: String,
        required: true,
    },
    listName: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    trainingData: {
        type: Object,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    campaginId: {
        type: Array,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const aiagents = mongoose.model('aiagents', aiAgentsSchema);
module.exports = aiagents;
