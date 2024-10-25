const express = require('express');
const router = express.Router();

require('dotenv').config();

const supportController = require('../controllers/support');


// Create Subscription
router.post('/createsupport', supportController.createSupportTicket);



module.exports = router;