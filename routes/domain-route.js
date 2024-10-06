const express = require('express');
const router = express.Router();

require('dotenv').config();

const domainController = require('../controllers/domain');


router.post('/addcustomdomain', domainController.addCustomDomain);
router.get('/finduserdomains/:organizationId', domainController.getAllUserDomains);

module.exports = router;
