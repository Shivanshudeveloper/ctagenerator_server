const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiController = require('../controllers/ai');


router.post('/getscore', aiController.getScoreSalesPage);
router.post('/summarizesalespagedata', aiController.getSummarizeSalesPage);


module.exports = router;
