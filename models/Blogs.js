const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    blogUid: {
        type: String,
        required: false,
    },
    blogPublicId: {
        type: Number,
        required: false,
        unique: true
    },
    title: {
        type: Object,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: false,
    },
    plainContent: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const blogs = mongoose.model('blogs', blogsSchema);
module.exports = blogs;
