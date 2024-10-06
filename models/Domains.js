const mongoose = require('mongoose');

const domainsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    organizationId:{
        type: String,
        required: false
    },
    domainName:{
        type: String,
        required: false
    },
    status:{
        type: Number,
        default: 0,
        required: true
    },
    records:{
        type: Object,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const domains = mongoose.model('domains', domainsSchema);
module.exports = domains;
