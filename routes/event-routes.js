const express = require('express');
const router = express.Router();

require('dotenv').config();

const eventController = require('../controllers/events');

// Events
router.post('/createusercampaignevent', eventController.createEvent);
router.get('/getuserevents/:organizationId', eventController.getAllUserEvents);
router.get('/getoneeventdetails/:eventUid', eventController.getEventById);
router.put('/updateusereventtype/:eventUid', eventController.updateEvent);
router.get('/getcampaignevents/:campaignUid', eventController.getEventsByCampaign);
router.delete('/removeuserevent/:eventUid', eventController.deleteEvent);


module.exports = router;