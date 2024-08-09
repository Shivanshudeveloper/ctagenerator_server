const express = require('express');
const router = express.Router();

require('dotenv').config();


// Auth
const validateController = require('../auth').validateToken;
const validateApiKeyController = require('../auth').authenticateApiKey;

// Controllers
const tokensController = require('../controllers/tokens');
const userController = require('../controllers/users');

router.get('/test', (req, res) => {
    res.send('Working');
});



// Generate new token for users
router.get('/getnewtoken', tokensController.generateUserToken);

// Users
router.post('/registeruser', userController.addRegisteredUser);

router.get('/checkuser', validateApiKeyController, userController.checkUser);
router.get('/getuser/:email', userController.getUserDetials);
router.get('/getuserplandetails/:organizationId', userController.getUserPlanDetails);





module.exports = router;