const express = require('express');
const router = express.Router();



require('dotenv').config();


// Controllers
const welcomeController = require('../controllers/welcome/welcomeTemplate');

// Validation
const validateApiKeyController = require('../auth').authenticateApiKey;


// Welcome Emails Routes
// Template1
router.post('/send/1', validateApiKeyController, welcomeController.sendWelcomeEmail_template1);
router.post('/send/2', validateApiKeyController, welcomeController.sendWelcomeEmail_template2);
router.post('/send/3', validateApiKeyController, welcomeController.sendWelcomeEmail_template3);
router.post('/send/4', validateApiKeyController, welcomeController.sendWelcomeEmail_template4);
router.post('/send/5', validateApiKeyController, welcomeController.sendWelcomeEmail_template5);
router.post('/send/6', validateApiKeyController, welcomeController.sendWelcomeEmail_template6);
router.post('/send/7', validateApiKeyController, welcomeController.sendWelcomeEmail_template7);
router.post('/send/8', validateApiKeyController, welcomeController.sendWelcomeEmail_template8);
router.post('/send/9', validateApiKeyController, welcomeController.sendWelcomeEmail_template9);
router.post('/send/10', validateApiKeyController, welcomeController.sendWelcomeEmail_template10);
router.post('/send/11', validateApiKeyController, welcomeController.sendWelcomeEmail_template11);
router.post('/send/12', validateApiKeyController, welcomeController.sendWelcomeEmail_template12);
router.post('/send/13', validateApiKeyController, welcomeController.sendWelcomeEmail_template13);
router.post('/send/14', validateApiKeyController, welcomeController.sendWelcomeEmail_template14);
router.post('/send/15', validateApiKeyController, welcomeController.sendWelcomeEmail_template15);
router.post('/send/16', validateApiKeyController, welcomeController.sendWelcomeEmail_template16);
router.post('/send/17', validateApiKeyController, welcomeController.sendWelcomeEmail_template17);
router.post('/send/18', validateApiKeyController, welcomeController.sendWelcomeEmail_template18);
router.post('/send/19', validateApiKeyController, welcomeController.sendWelcomeEmail_template19);
router.post('/send/20', validateApiKeyController, welcomeController.sendWelcomeEmail_template20);
router.post('/send/21', validateApiKeyController, welcomeController.sendWelcomeEmail_template21);
router.post('/send/22', validateApiKeyController, welcomeController.sendWelcomeEmail_template22);
router.post('/send/23', validateApiKeyController, welcomeController.sendWelcomeEmail_template23);
router.post('/send/24', validateApiKeyController, welcomeController.sendWelcomeEmail_template24);
router.post('/send/25', validateApiKeyController, welcomeController.sendWelcomeEmail_template25);
router.post('/send/26', validateApiKeyController, welcomeController.sendWelcomeEmail_template26);
router.post('/send/27', validateApiKeyController, welcomeController.sendWelcomeEmail_template27);
router.post('/send/28', validateApiKeyController, welcomeController.sendWelcomeEmail_template28);
router.post('/send/29', validateApiKeyController, welcomeController.sendWelcomeEmail_template29);


module.exports = router;