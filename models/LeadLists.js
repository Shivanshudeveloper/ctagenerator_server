const mongoose = require('mongoose');

const leadlistsSchema = new mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    organizationId:{
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const leadlists = mongoose.model('leadlists', leadlistsSchema);
module.exports = leadlists;
