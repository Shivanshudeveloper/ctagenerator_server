const express = require('express');
const router = express.Router();

require('dotenv').config();

const otherServicesController = require('../controllers/other-services');
const validateUserEngagementLimit = require('../auth').authenticateUserEngagementCreditLimit;


router.post('/generateemail', validateUserEngagementLimit, otherServicesController.generateEmail);
router.post('/generatecolddms', validateUserEngagementLimit, otherServicesController.generateColdDm);

// APIs for Public Use
router.post('/generateemailaiagent', validateUserEngagementLimit, otherServicesController.generateEmailAiAgent);
router.post('/generatedmaiagent', validateUserEngagementLimit, otherServicesController.generateColdDmAiAgent);


// AI Agent Workflow
router.post('/savedraftagentsettings', validateUserEngagementLimit, otherServicesController.saveSettings);
router.get('/getthedraftagentsettings/:agentObjectId', otherServicesController.getAiAgentSettings);


// Get Draft Leads
router.get('/getdraftleads/:agentUid', otherServicesController.getDraftLeads);
router.get('/getalldraftleads/:agentUid', otherServicesController.getAllDraftLeads);


module.exports = router;
