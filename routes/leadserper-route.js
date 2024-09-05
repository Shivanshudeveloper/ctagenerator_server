const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadSerperController = require('../controllers/leadserper');

// Leads
router.post('/findleadsserper', leadSerperController.searchLeads);


module.exports = router;