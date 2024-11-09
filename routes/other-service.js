const express = require('express');
const router = express.Router();

require('dotenv').config();

const otherServicesController = require('../controllers/other-services');
const validateUserEngagementLimit = require('../auth').authenticateUserEngagementCreditLimit;


router.post('/generateemail', validateUserEngagementLimit, otherServicesController.generateEmail);

router.post('/generatecolddms', validateUserEngagementLimit, otherServicesController.generateColdDm);

module.exports = router;
