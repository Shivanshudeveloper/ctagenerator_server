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


module.exports = router;
