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
router.post('/savedraftagentsettings', otherServicesController.saveSettings);
router.get('/getthedraftagentsettings/:agentObjectId', otherServicesController.getAiAgentSettings);
router.get('/getthewebsiteagentsettings/:agentObjectId', otherServicesController.getAiAgentWebsiteScraperSettings);


router.post('/updatedraftsettings', otherServicesController.updateDraftSettingEnable);


// Get Draft Leads
router.get('/getdraftleads/:agentUid', otherServicesController.getDraftLeads);
router.get('/getdraftleadsemailsending/:listName/:organizationId', otherServicesController.getDraftLeadsEmailSending);

router.get('/getemailstats/:listName/:organizationId', otherServicesController.getEmailSendingStats);
router.get('/getemailsendgraphdata/:listName/:organizationId', otherServicesController.getEmailSendGraphData);

router.get('/getalldraftleads/:agentUid', otherServicesController.getAllDraftLeads);


// Resend Send Emails AI Agent
router.post('/sendemaildomainaiagent', otherServicesController.sendEmailResendDomain);



module.exports = router;
