const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiagentsinstructionsController = require('../controllers/aiagentsinstructions');


// For Scraper Email and Phone
router.post('/getscraperinstruction', aiagentsinstructionsController.findScraperInstructions);

// For Lead Finder Filters
router.post('/getleadfinderfilters', aiagentsinstructionsController.findLeadFinderInstructions);


module.exports = router;
