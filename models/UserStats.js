const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema({
  leads_generated: {
    type: Number,
    required: false,
  },
  links_clicked: {
    type: Number,
    required: false,
  },
  email_delivered: {
    type: Number,
    required: false,
  },
  email_opened: {
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
  date: {
    type: Date,
    required: false,
  },
});

const user_stats = mongoose.model("user_stats", userStatsSchema);
module.exports = user_stats;
