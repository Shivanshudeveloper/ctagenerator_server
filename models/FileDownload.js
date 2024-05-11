const mongoose = require('mongoose');

const leadsDownloadSchema = new mongoose.Schema({
  public_url: {
    type: String,
    required: false,
  },
  organizationId: {
    type: String,
    required: false,
  },
  client_email: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LeadsDownload = mongoose.model('file_downloads', leadsDownloadSchema);
module.exports = LeadsDownload;
