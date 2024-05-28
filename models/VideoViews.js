const mongoose = require('mongoose');

const videoViewsSchema = new mongoose.Schema({
    ctaPublicId: {
        type: String,
        required: true
    },
    userIpAddress: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const videoViews = mongoose.model('VideoViews', videoViewsSchema);
module.exports = videoViews;
