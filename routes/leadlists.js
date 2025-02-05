const express = require('express');
const router = express.Router();

require('dotenv').config();

const leadlistController = require('../controllers/leadlist');


router.post('/submitnewlistuser', leadlistController.addNewUserList);
router.post('/addleadstolistuser', leadlistController.addLeadsToList);
router.get('/getuserleadlists/:organizationId', leadlistController.getAllUserListsLeads);
router.get('/getleadsinlist/:listName/:organizationId', leadlistController.getLeadsInList);

router.post('/saveleadsfilters', leadlistController.saveLeadsFilters);

router.get('/getuserleadlistssingle/:id', leadlistController.getLeadsInListSingle);

router.post('/uploaduserdatatolist', leadlistController.uploadUserDataCsv);
router.get('/downloadallleadsuserleadlist/:listName/:organizationId', leadlistController.downloadLeads);
router.delete('/deleteuserlist/:listName/:organizationId', leadlistController.deleteUserListLeadData);

// Change the status of a filter
router.post('/updateaiagentstaus', leadlistController.updateLeadFilterStatus);
router.get('/getaiagentrunningstatus/:aiAgentUid', leadlistController.getAiAgentRunningStatus);


module.exports = router;
