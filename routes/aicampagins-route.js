const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiCampaginsController = require('../controllers/aicampagins');


router.post('/createnewaicampagin', aiCampaginsController.createNewAiCampagin);


module.exports = router;
