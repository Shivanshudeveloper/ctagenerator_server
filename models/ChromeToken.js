const mongoose = require('mongoose');

const chomeExtentionTokenSchema = new mongoose.Schema({
    chromeToken: {
        type: String,
        required: false,
        unique: true
    },
    title: {
        type: String,
        required: false,
    },
    organizationId: {
        type: String,
        required: false,
    },
    userEmail: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true, 
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const chromeextentiontoken = mongoose.model('chromeextentiontoken', chomeExtentionTokenSchema);
module.exports = chromeextentiontoken;
