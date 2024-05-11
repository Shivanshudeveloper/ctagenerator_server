const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadsController = require('../controllers/leads');

// Leads
router.get('/checkleads/:organizationId', leadsController.checkLeads);
router.get('/getallleadsuser/:organizationId', leadsController.getAllLeadsUser);
router.get('/getallleadsuserdownload/:organizationId', leadsController.getUserLeadsDownload);


module.exports = router;