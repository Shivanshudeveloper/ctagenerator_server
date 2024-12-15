const mongoose = require('mongoose');

const leadFiltersSchema = new mongoose.Schema({
    listName: {
        type: String,
        required: true,
    },
    organizationId: {
        type: String,
        required: true,
    },
    query: {
        type: Object,
        required: true,
    },
    skip: {
        type: Number,
        required: true,
    },
    leadsQty: {
        type: Number,
        required: true,
    },
    leadsQtyDone: {
        type: Number,
        default: 0,
        required: false
    },
    leadsQtyLeft: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: false
    },
    status: {
        type: Number,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const LeadFilters = mongoose.model('leadfilters', leadFiltersSchema);
module.exports = LeadFilters;
