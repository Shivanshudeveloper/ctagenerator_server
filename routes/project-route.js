const express = require('express');
const router = express.Router();


require('dotenv').config();


// Controllers
const projectController = require('../controllers/project');

// Welcome Emails Routes
// Template1
router.post('/createproject', projectController.createNewProject);
router.get('/getproject/:projectId', projectController.getProjectDetails);
router.get('/getallproject/:organizationId', projectController.getAllProject);
router.delete('/deleteproject/:projectId', projectController.deleteProjectDetails);
// router.get('/getProjectNameById/:id', projectController.getProjectNameById);





module.exports = router;