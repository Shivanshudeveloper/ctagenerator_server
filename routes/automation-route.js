const express = require('express');
const router = express.Router();

require('dotenv').config();

const automationController = require('../controllers/automation');

// PHONE NUMBER
// Create new phone number
router.post('/addnewphonenumbercreate', automationController.createPhoneNumber);
// Update phone number status
router.put('/updatestatusphonenumber', automationController.updatePhoneNumberStatus);
// Delete phone number
router.delete('/deletephonenumber/:phoneNumber', automationController.deletePhoneNumber);
// Find one by organization ID
router.get('/findorganizationphonenumber/:organizationId', automationController.findByOrganizationId);
// Find one by phone number
router.get('/fineonephonenumber/:phoneNumber', automationController.findByPhoneNumber);
// Find all phone numbers
router.get('/findallphonenumber', automationController.findAllPhoneNumbers);



// CAMPAIGN LEADS

// Update campaginlead
router.put('/updatecampaignlead', automationController.updateCampaignLead);


// CONVERSATIONS

// Update campaginlead
router.post('/addleadconversations', automationController.addLeadConversations);



module.exports = router;