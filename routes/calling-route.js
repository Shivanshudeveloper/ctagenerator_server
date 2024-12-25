const express = require('express');
const router = express.Router();

require('dotenv').config();

const callingController = require('../controllers/calling');


router.post('/manualcall', callingController.makeManualCallCampaign);


module.exports = router;
