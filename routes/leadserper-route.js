const express = require('express');
const router = express.Router();

require('dotenv').config();

const validateUserLeadsLimit = require('../auth').authenticateUserLeadsCreditLimit;

const leadSerperController = require('../controllers/leadserper');

// Leads
router.post('/findleadsserper', validateUserLeadsLimit, leadSerperController.searchLeads);


module.exports = router;