const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  priceType: {
    type: String,
    required: false,
  },
  plan: {
    type: String,
    required: true,
    default: 'free', 
  },
  planPurchaseDate: {
    type: Date,
    required: false,
  },
  lastPaymentMadeDate: {
    type: Date,
    required: false,
  },
  nextPaymentDate: {
    type: Date,
    required: false,
  },
  apiKey: {
    type: String,
    required: false,
  },
  leadsCredit: {
    type: Number,
    required: false,
  },
  engageCredit: {
    type: Number,
    required: false,
  },
  chromeExtentionCredit: {
    type: Number,
    required: false,
  },
  accountStatus: {
    type: Number,
    required: false,
    default: 1, 
  },
  termsAndCondition: {
    type: Boolean,
    required: true,
    default: true, 
  },
  credits: {
    emailScraper: { type: Number, default: 0 },
    linkedinResearch: { type: Number, default: 0 },
    linkedinProfiles: { type: Number, default: 0 },
    phoneScraper: { type: Number, default: 0 },
    leadFinder: { type: Number, default: 0 },
    conversational: { type: Number, default: 0 },
    messageOnly: { type: Number, default: 0 },
    yesNo: { type: Number, default: 0 },
    draftEmails: { type: Number, default: 0 },
    draftDms: { type: Number, default: 0 },
    emailSending: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('users', userSchema);
module.exports = User;
