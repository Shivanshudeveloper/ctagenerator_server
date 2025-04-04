const mongoose = require("mongoose");

const socialaccountsSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true,
    },
    listName: {
        type: String,
        required: true,
    },
    agentUid: {
        type: String,
        required: true,
    },
    accountId: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: false
    },
    totalRequestSent: {
        type: Number,
        required: false
    },
    totalMessageSent: {
        type: Number,
        required: false
    },
    sendingStatus: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const socialaccounts = mongoose.model("socialaccounts", socialaccountsSchema);
module.exports = socialaccounts;
// test