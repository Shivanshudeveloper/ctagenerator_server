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
