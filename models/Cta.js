const mongoose = require('mongoose');

const ctaSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: false,
    },
    feedback: {
        type: Boolean,
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
    links: {
        type: Array,
        required: false,
    },
    message:{
        type:Object,
        required:false
    },
    aiAgent:{
        type:Object,
        required:false
    },
    photos: {
        type: Object,
        required: false,
    },
    banner: {
        type: Object,
        required: false,
    },
    footer: {
        type: Object,
        required: false,
    },
    pauseCtaData:{
        type: Object,
        required: false,
    },
    linkClicksCount: {
        type: Number,
        required: false,
        default: 0,
    },
    viewCount: {
        type: Number,
        required: false,
        default: 0,
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
