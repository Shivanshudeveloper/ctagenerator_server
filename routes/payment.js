const express = require('express');
const router = express.Router();

require('dotenv').config();

const paymentController = require('../controllers/payment');


// Create Subscription
router.post('/createcheckoutsession', paymentController.createCheckoutSession);
router.get('/checkstatus/:customerId', paymentController.checkSubscriptionStatus);
router.put('/alertseen/:customerId', paymentController.alertSeen);
router.get('/getinfouserstatusaccount/:organizationId/:reason', paymentController.getUserAccountStatus);
router.get('/gettransactionuserdetail/:organizationId', paymentController.getUserHistoryTransaction);


// Razor Pay Payment
router.post('/order', paymentController.createRazorpayOrder);
router.post('/chrometokenorder', paymentController.createChromeTokenOrder);
router.post('/success', paymentController.successRazorPay);
router.post('/success2', paymentController.successRazorPay2);

// Credits Razor Pay Payment
router.post('/ordercredits', paymentController.createRazorpayOrderCredits);
router.post('/creditssuccess', paymentController.successRazorPayCredits);
router.get('/getusercredits/:organizationId', paymentController.checkCreditsUsage);

module.exports = router;