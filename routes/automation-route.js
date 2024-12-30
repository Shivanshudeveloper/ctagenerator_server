const express = require('express');
const router = express.Router();

require('dotenv').config();

const automationController = require('../controllers/automation');

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

module.exports = router;