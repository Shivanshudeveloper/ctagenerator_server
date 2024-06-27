const mongoose = require('mongoose');

const ctaContactsSchema = new mongoose.Schema({
    ctaPublicId: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true,
    },
    notify_status:{
        type: String,
        required: true,
        default:'To be Notified'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const ctaContacts = mongoose.model('CtaContacts', ctaContactsSchema);
module.exports = ctaContacts;
