const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadlistController = require('../controllers/leadlist');


router.post('/submitnewlistuser', leadlistController.addNewUserList);
router.post('/addleadstolistuser', leadlistController.addLeadsToList);
router.get('/getuserleadlists/:organizationId', leadlistController.getAllUserListsLeads);


module.exports = router;
