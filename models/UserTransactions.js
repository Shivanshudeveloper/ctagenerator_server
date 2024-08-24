const mongoose = require('mongoose');

const userTransactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  organizationId: {
    type: String,
    required: false,
  },
  paymentType: {
    type: String,
    required: false,
  },
  plan: {
    type: String,
    required: true,
    default: 'free', 
  },
  channel: {
    type: String,
    required: true,
    default: 'PayPal', 
  },
  paymentInformation: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTransaction = mongoose.model('userTransactions', userTransactionSchema);
module.exports = UserTransaction;
