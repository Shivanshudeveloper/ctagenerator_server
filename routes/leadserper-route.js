const express = require('express');
const router = express.Router();

require('dotenv').config();

const validateUserLeadsLimit = require('../auth').authenticateUserLeadsCreditLimit;

const leadSerperController = require('../controllers/leadserper');

// Leads
router.post('/findleadsserper', validateUserLeadsLimit, leadSerperController.searchLeads);
router.post('/findleadsserpernamelookup', validateUserLeadsLimit, leadSerperController.searchLeadsNameLookup);


// Phone Number
router.post('/phonefindleadsserper', validateUserLeadsLimit, leadSerperController.searchLeadsPhone);

module.exports = router;