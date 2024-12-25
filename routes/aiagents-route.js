const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiAgentController = require('../controllers/aiagents');


router.post('/createnewaiagent', aiAgentController.createNewAiAgent);
router.delete('/removeaiagent/:_id', aiAgentController.deleteAiAgent);
router.put('/updateaiagent/:_id', aiAgentController.updateAiAgent);
router.get('/findoneaiagentdetail/:aiAgentUid', aiAgentController.findOneAiAgent);
router.get('/findorganizationaiagentdetail/:organizationId', aiAgentController.findAllAiAgentsByOrg);


module.exports = router;
