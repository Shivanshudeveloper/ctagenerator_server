const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadsController = require('../controllers/leads');
const linkedinController = require('../controllers/linkedin');

// Connect New LinkedIn Account
router.get('/connectlinkedinaccount/:organizationId/:listName', linkedinController.connectLinkedInAccount);

// Call Back LinkedIn Account
router.post('/linkedincallback/:organizationId/:listName', linkedinController.callBackLinkedIn);


// Get Organization Accounts
router.post('/getorganizationaccounts', linkedinController.getAllAccount);

module.exports = router;