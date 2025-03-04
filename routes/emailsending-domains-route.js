const express = require('express');
const router = express.Router();

require('dotenv').config();

const emailSendingDomain = require('../controllers/emailsendingdomains');


router.post('/addemailsendingadddomain', emailSendingDomain.addEmailSendingDomain);

router.get('/getalltheuserdomain/:organizationId', emailSendingDomain.getAllUserDomainsEmailSending);

router.post('/verifydomainemailsending', emailSendingDomain.verifyDomainEmailSending);


module.exports = router;
