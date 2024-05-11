const express = require('express');
const router = express.Router();

require('dotenv').config();

const linksTrackController = require('../controllers/links-track');

// Leads
router.get('/:organizationId', linksTrackController.increaseLinksCount);

module.exports = router;