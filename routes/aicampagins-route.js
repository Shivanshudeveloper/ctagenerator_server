const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiCampaginsController = require('../controllers/aicampagins');


router.post('/createnewaicampagin', aiCampaginsController.createNewAiCampagin);
router.get('/getalluseraicampaign/:organizationId', aiCampaginsController.getAllUserCampaignDetails);

router.get('/getcampaginleads/:campaignUid', aiCampaginsController.getCampaignLeads);
router.get('/getcampagindetails/:_id', aiCampaginsController.getCampaignDetails);
router.put('/updatethestatuscampaginlead/:leadId/:campaignUid', aiCampaginsController.updateCampaignLeadStatus);

// Make a Live Call
router.post('/makeatestlivecall', aiCampaginsController.makeTestCallCampaign);



module.exports = router;
