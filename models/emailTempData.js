const mongoose = require("mongoose");

const emailtempSchema = new mongoose.Schema({
  journeyTitle: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  templateID: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
});

const emailtemp = mongoose.model("emailtempData", emailtempSchema);
module.exports = emailtemp;
