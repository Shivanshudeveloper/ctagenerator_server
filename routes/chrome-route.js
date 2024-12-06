const express = require('express');
const router = express.Router();

require('dotenv').config();

const chromeController = require('../controllers/chrome');


router.post('/generatechrometoken', chromeController.createChromeToken);
router.get('/getuseralltoken/:organizationId', chromeController.getUserToken);
router.put('/updateuserchrometoken/:chromeId', chromeController.updateChromeToken);
router.get('/validatechrometoken/:chromeToken', chromeController.validateChromeToken);
router.get('/getchrometokendetails/:chromeToken', chromeController.getDetailsChromeToken);
router.post('/purchasechromecredits', chromeController.purchaseChromeCredits);
router.get('/getuserchromecredits/:organizationId', chromeController.getUserChromeCredits);


module.exports = router;
