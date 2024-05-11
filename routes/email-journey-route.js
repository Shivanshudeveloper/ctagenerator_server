const express = require('express');
const router = express.Router();



require('dotenv').config();


// Controllers
const emailJourneyController = require('../controllers/email_journey');


// Create Email Joruney
router.post('/createemailjourney', emailJourneyController.createEmailJourney);
router.put('/updatejourney', emailJourneyController.updateEmailJourney);
router.delete('/deleteemailjourney/:emailJoruneyId', emailJourneyController.deleteEmailJourney);
router.get('/emailsend/:organizationId', emailJourneyController.getUserEmailSend);

module.exports = router;