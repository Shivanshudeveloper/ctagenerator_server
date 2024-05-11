const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
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

const Project = mongoose.model('projects', projectSchema);
module.exports = Project;
