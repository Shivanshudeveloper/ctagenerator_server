const mongoose = require('mongoose');

const ctaCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: {
        type: Number,
        required: true,
        default: 1000, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ctacounter = mongoose.model('ctacounter', ctaCounterSchema);
module.exports = ctacounter;
