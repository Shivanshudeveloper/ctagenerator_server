const express = require('express');
const router = express.Router();

require('dotenv').config();


const ctaController = require('../controllers/cta');

router.get('/test', (req, res) => {
    res.send('Working');
});


// Users
router.post('/create', ctaController.createCta);
router.get('/getpublicid/:ctaPublicId', ctaController.getCtabyPublicId);
router.delete('/removecta/:ctaid', ctaController.deleteCta);
router.get('/getuserctaall/:organizationId', ctaController.getCtaforUser);
router.get('/getadminallctasystem', ctaController.getAllCtaInSystem);
router.put('/updatectadetails', ctaController.updateCtaDetails);



module.exports = router;