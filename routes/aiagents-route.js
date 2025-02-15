const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiAgentController = require('../controllers/aiagents');


router.post('/createnewaiagent', aiAgentController.createNewAiAgent);
router.delete('/removeaiagent/:aiAgentUid', aiAgentController.deleteAiAgent);
router.put('/updateaiagent/:_id', aiAgentController.updateAiAgent);
router.put('/updatedselectedagentsmanager/:_id', aiAgentController.updateAiAgentSelectedAgentsManger);
router.get('/findoneaiagentdetail/:aiAgentUid', aiAgentController.findOneAiAgent);
router.get('/findorganizationaiagentdetail/:organizationId', aiAgentController.findAllAiAgentsByOrg);

router.post('/speakingliveaudio', aiAgentController.liveAudioAiAgentSpeaking);

// New AI Agent Flow
router.post('/createnewaiagentworkflow', aiAgentController.createNewAiAgentWorkFlow);
router.put('/updateaiagentleadfinder/:_id', aiAgentController.updateAiAgentLeadFinderWorkFlow);
router.put('/updateaiagentleadscraper/:_id', aiAgentController.updateAiAgentLeadScraperWorkFlow);
router.put('/updateaiagentwebsitescraper/:_id', aiAgentController.updateAiAgentWebsiteScraperWorkFlow);
router.post('/findoneaiagnetworkflowleadfinder', aiAgentController.findOneAiAgentWorkFlowLeadFinder);

// Website Scraper
router.post('/scrapewebsitetrainingagent', aiAgentController.getWebsiteUrlData);
router.post('/structurescraperwebsitedata', aiAgentController.structureDataWebsiteScraper);



module.exports = router;
