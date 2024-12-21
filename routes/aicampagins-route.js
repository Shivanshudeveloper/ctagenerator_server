const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiCampaginsController = require('../controllers/aicampagins');


router.post('/createnewaicampagin', aiCampaginsController.createNewAiCampagin);
router.get('/getcampaginleads/:campaignUid', aiCampaginsController.getCampaignLeads);
router.put('/updatethestatuscampaginlead/:leadId/:campaignUid', aiCampaginsController.updateCampaignLeadStatus);


module.exports = router;
