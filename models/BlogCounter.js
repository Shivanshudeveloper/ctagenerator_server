const mongoose = require('mongoose');

const blogCounterSchema = new mongoose.Schema({
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

const blogcounter = mongoose.model('blogcounter', blogCounterSchema);
module.exports = blogcounter;
