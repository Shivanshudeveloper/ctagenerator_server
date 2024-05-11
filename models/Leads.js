const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  linkedin_url: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  organization_name: {
    type: String,
    required: false,
  },
  organization_linkedIn: {
    type: String,
    required: false,
  },
  organization_domain: {
    type: String,
    required: false,
  },
  industries: {
    type: String,
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

const leads = mongoose.model("leads", leadsSchema);
module.exports = leads;
