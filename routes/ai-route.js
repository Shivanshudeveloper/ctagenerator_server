const express = require('express');
const router = express.Router();

require('dotenv').config();

const aiController = require('../controllers/ai');


router.post('/getscore', aiController.getScoreSalesPage);


module.exports = router;
