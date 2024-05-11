const express = require('express');
const router = express.Router();

require('dotenv').config();

//Controllers
const verificationController = require('../controllers/signup/verificationemail');


// Sign Up Emails Routes
// Email Verification Template Send
router.post('/sendverificationemail', verificationController.sendVerificationEmail);

module.exports = router;