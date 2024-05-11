const express = require('express');
const router = express.Router();

const userStatsController = require('../controllers/user_stats');

// User Stats
router.get('/getuserstats/:organizationId', userStatsController.checkUserStats);
router.get('/getusertotallinks/:organizationId', userStatsController.checkUserStatsTotalLinks);

// Count People by Job Title
router.get('/countpeoplebyjobtitle/:organizationId', userStatsController.countPeopleByJobTitle);

// Count Leads by Date (added route)
router.get('/countleadsbydate/:organizationId', userStatsController.countLeadByDate);

// Count People by Country
router.get('/countbypeoplecountry/:organizationId', userStatsController.countByCountry);

module.exports = router;
