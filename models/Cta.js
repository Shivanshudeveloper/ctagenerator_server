const mongoose = require('mongoose');

const ctaSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: false,
    },
    userEmail: {
        type: String,
        required: false,
    },
    typecta: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    ctaUid: {
        type: String,
        required: false,
    },
    ctaPublicId: {
        type: Number,
        required: false,
        unique: true
    },
    calendarUrl: {
        type: String,
        required: false,
    },
    pacakages: {
        type: Array,
        required: false,
    },
    features: {
        type: Array,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: 1, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const cta = mongoose.model('cta', ctaSchema);
module.exports = cta;
