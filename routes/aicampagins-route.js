const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiCampaginsController = require('../controllers/aicampagins');


router.post('/createnewaicampagin', aiCampaginsController.createNewAiCampagin);
router.get('/getalluseraicampaign/:organizationId', aiCampaginsController.getAllUserCampaignDetails);
router.get('/getcampaginleads/:campaignUid', aiCampaginsController.getCampaignLeads);

router.get('/getallcampaginleads/:campaignUid', aiCampaginsController.getAllCampaignLeads);

router.get('/getcampagindetails/:_id', aiCampaginsController.getCampaignDetails);
router.put('/updatethestatuscampaginlead/:leadId/:campaignUid', aiCampaginsController.updateCampaignLeadStatus);
router.put('/updatecampagindetails/:_id', aiCampaginsController.updateAiCampagin);
router.delete('/deletecampaignuserdata/:campaignUid', aiCampaginsController.deleteAiCampagin);

// Make a Live Call
router.post('/makeatestlivecall', aiCampaginsController.makeTestCallCampaign);



module.exports = router;
