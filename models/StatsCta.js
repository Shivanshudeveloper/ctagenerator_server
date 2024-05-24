const e = require('express');
const mongoose = require('mongoose');

const clicksCtaSchema = new mongoose.Schema({
    userIpAddress: {
        type: String,
        required: false,
    },
    userLocation: {
        type: String,
        required: false,
    },
    userBrowser: {
        type: String,
        required: false,
    },
    userDevice: {
        type: String,
        required: false,
    },
    ctaUid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'cta',
    },
    clickType:{
        type: String, // link, view, video
        required: false,
    },
    videoStats:{
        type: Object,
        required: false,
    },
    totalTimeSpent:{
        type: Number,
        required: false,
    },
    ctaPublicId: {
        type: Number,
        required: false,
    },
    ctaClientEmail: {
        type: String,
        required: false,
    },  
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const clicksCta = mongoose.model('clicksCta', clicksCtaSchema);
module.exports = clicksCta;