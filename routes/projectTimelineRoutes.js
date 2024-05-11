const express = require("express");
const router = express.Router();
const projectTimelineController = require("../controllers/project-timeline/projectTimelineController");


router.post("/projects", projectTimelineController.createProject);

// Get a project by ID
router.get("/getprojecttimeline/:organizationId/:data", projectTimelineController.getProjectById);

// Update a project by ID
router.put("/projects/:organisation_id", projectTimelineController.updateProjectById);

// Delete a project by ID
router.delete("/projects/:organisation_id", projectTimelineController.deleteProjectById);

// Get all projects
router.get("/projects", projectTimelineController.getAllProjects);


module.exports = router;
