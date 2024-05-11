const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client_email: {
    type: String,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  project_title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ProjectTimeline_model = mongoose.model('project_timeline', projectSchema);

module.exports = ProjectTimeline_model;
