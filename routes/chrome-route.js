const express = require('express');
const router = express.Router();

require('dotenv').config();

const chromeController = require('../controllers/chrome');


router.post('/generatechrometoken', chromeController.createChromeToken);
router.get('/getuseralltoken/:organizationId', chromeController.getUserToken);
router.put('/updateuserchrometoken/:chromeId', chromeController.updateChromeToken);


module.exports = router;
