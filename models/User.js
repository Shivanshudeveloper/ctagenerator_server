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
  plan: {
    type: String,
    required: true,
    default: 'free', 
  },
  apiKey: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('users', userSchema);
module.exports = User;
