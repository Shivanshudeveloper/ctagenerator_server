const express = require('express');
const router = express.Router();

require('dotenv').config();

const otherServicesController = require('../controllers/other-services');


router.post('/generateemail', otherServicesController.generateEmail);

module.exports = router;
