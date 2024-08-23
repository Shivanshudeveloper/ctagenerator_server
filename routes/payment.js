const express = require('express');
const router = express.Router();

require('dotenv').config();

const paymentController = require('../controllers/payment');


// Create Subscription
router.post('/createcheckoutsession', paymentController.createCheckoutSession);
router.get('/checkstatus/:customerId', paymentController.checkSubscriptionStatus);
router.put('/alertseen/:customerId', paymentController.alertSeen);
router.get('/getinfouserstatusaccount/:organizationId', paymentController.getUserAccountStatus);


// Razor Pay Payment
router.post('/order', paymentController.createRazorpayOrder);
router.post('/success', paymentController.successRazorPay);

module.exports = router;