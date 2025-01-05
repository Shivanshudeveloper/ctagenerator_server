const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventUid: {
        type: String,
        required: true
    },
    organizationId:{
        type: String,
        required: false
    },
    eventType:{
        type: String,
        required: false
    },
    campaignUid:{
        type: String,
        required: false
    },
    subject:{
        type: String,
        required: false
    },
    content:{
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const eventmodel = mongoose.model('event', eventSchema);
module.exports = eventmodel;
