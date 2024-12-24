const mongoose = require('mongoose');

const PhoneNumbersSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    organizationId: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const phoneNumbers = mongoose.model('phoneNumbers', PhoneNumbersSchema);
module.exports = phoneNumbers;
