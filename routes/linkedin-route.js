const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadsController = require('../controllers/leads');
const linkedinController = require('../controllers/linkedin');

// Connect New LinkedIn Account
router.get('/connectlinkedinaccount/:organizationId/:listName/:agentUid', linkedinController.connectLinkedInAccount);

// Call Back LinkedIn Account
router.post('/linkedincallback/:organizationId/:listName/:agentUid', linkedinController.callBackLinkedIn);


// Get Organization Accounts
router.post('/getorganizationaccounts', linkedinController.getAllAccount);


// Remove LinkedIn Account
router.post('/removetheaccount', linkedinController.removeLinkedInAccount);


module.exports = router;