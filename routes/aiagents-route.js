const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiAgentController = require('../controllers/aiagents');


router.post('/createnewaiagent', aiAgentController.createNewAiAgent);
router.delete('/removeaiagent/:aiAgentUid', aiAgentController.deleteAiAgent);
router.put('/updateaiagent/:_id', aiAgentController.updateAiAgent);
router.get('/findoneaiagentdetail/:aiAgentUid', aiAgentController.findOneAiAgent);
router.get('/findorganizationaiagentdetail/:organizationId', aiAgentController.findAllAiAgentsByOrg);

router.post('/speakingliveaudio', aiAgentController.liveAudioAiAgentSpeaking);

// New AI Agent Flow
router.post('/createnewaiagentworkflow', aiAgentController.createNewAiAgentWorkFlow);
router.put('/updateaiagentleadfinder/:_id', aiAgentController.updateAiAgentLeadFinderWorkFlow);
router.post('/findoneaiagnetworkflowleadfinder', aiAgentController.findOneAiAgentWorkFlowLeadFinder);


module.exports = router;
