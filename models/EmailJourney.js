const mongoose = require('mongoose');

const emailJoruneySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Untitled", 
  },
  userEmail: {
    type: String,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  emailJoruneyId: {
    type: String,
    required: true,
  },
  emailTemplateId: {
    type: String,
    required: true,
  },
  emailAppName: {
    type: String,
    required: false,
  },
  emailSendersName: {
    type: String,
    required: false,
  },
  emailSendersCompany: {
    type: String,
    required: false,
  },
  emailDesignation: {
    type: String,
    required: false,
  },
  emailLogo: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    required: false,
    default: 1, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailJoruney = mongoose.model('emailjoruney', emailJoruneySchema);
module.exports = EmailJoruney;
