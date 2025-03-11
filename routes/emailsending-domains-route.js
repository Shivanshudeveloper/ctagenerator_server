const express = require('express');
const router = express.Router();

require('dotenv').config();

const emailSendingDomain = require('../controllers/emailsendingdomains');

// Domains
router.post('/addemailsendingadddomain', emailSendingDomain.addEmailSendingDomain);
router.get('/getalltheuserdomain/:organizationId', emailSendingDomain.getAllUserDomainsEmailSending);
router.post('/verifydomainemailsending', emailSendingDomain.verifyDomainEmailSending);


// Mailboxes
router.post('/adddomainemailbox', emailSendingDomain.addEmailSendingMailbox);
router.get('/getalltheusermailboxes/:organizationId/:listName', emailSendingDomain.getAllUserMailboxEmailSending);
router.delete('/deletethemailbox/:organizationId/:mailbox', emailSendingDomain.deleteMailBoxEmailSending);


module.exports = router;
