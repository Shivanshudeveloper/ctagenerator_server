const express = require('express');
const router = express.Router();

require('dotenv').config();

const chromeController = require('../controllers/chrome');


router.post('/generatechrometoken', chromeController.createChromeToken);
router.get('/getuseralltoken/:organizationId', chromeController.getUserToken);
router.put('/updateuserchrometoken/:chromeId', chromeController.updateChromeToken);
router.get('/validatechrometoken/:chromeToken', chromeController.validateChromeToken);


module.exports = router;
