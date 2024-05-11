const express = require('express');
const router = express.Router();

require('dotenv').config();


const ctaController = require('../controllers/cta');

router.get('/test', (req, res) => {
    res.send('Working');
});


// Users
router.post('/create', ctaController.createCta);


module.exports = router;