const mongoose = require('mongoose');

const leadlistsDataSchema = new mongoose.Schema({
    organizationId:{
        type: String,
        required: false
    },
    listName:{
        type: String,
        required: false
    },
    Email:{
        type: String,
        required: false
    },
    Phone_Number:{
        type: String,
        required: false
    },
    Location:{
        type: String,
        required: false
    },
    Niche:{
        type: String,
        required: false
    },
    Link:{
        type: String,
        required: false
    },
    Company_Name:{
        type: String,
        required: false
    },
    Company_Website:{
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const leadlistsData = mongoose.model('leadlistsData', leadlistsDataSchema);
module.exports = leadlistsData;
