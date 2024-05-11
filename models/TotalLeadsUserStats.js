const mongoose = require("mongoose");

const userTotalStatsSchema = new mongoose.Schema({
    total_email_delivered: {
        type: Number,
        required: false,
    },
    total_links_clicked: {
        type: Number,
        required: false,
    },
    total_email_opened: {
        type: Number,
        required: false,
    },
    client_email: {
        type: String,
        required: false,
    },
    organizationId: {
        type: String,
        required: false,
    },
    meeting_link: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: false,
    },
});

const total_user_stats = mongoose.model("total_user_stats", userTotalStatsSchema);
module.exports = total_user_stats;
