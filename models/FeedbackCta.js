const mongoose = require('mongoose');

const ctaFeedbackSchema = new mongoose.Schema({
    ctaPublicId: {
        type: String,
        required: true
    },
    feedback:{
        type: String,
        required: false
    },
    clieIdLoc:{
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const ctaFeedback = mongoose.model('ctaFeedback', ctaFeedbackSchema);
module.exports = ctaFeedback;
