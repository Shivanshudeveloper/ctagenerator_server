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
router.delete('/removecta/:ctaPublicId', ctaController.deleteCta);
router.get('/getuserctaall/:organizationId', ctaController.getCtaforUser);
router.get('/getadminallctasystem', ctaController.getAllCtaInSystem);
router.put('/updatectadetails', ctaController.updateCtaDetails);
router.put('/updatectacounts/:ctaPublicId', ctaController.updateCtaCounts);
router.post('/getctaclicksdetails/:ctaPublicId', ctaController.getCtaClicksDetails);
router.get('/getallctaclickstats/:organizationId', ctaController.getAllCtaClickStats);
router.get('/getctaclickslogs/:ctaPublicId', ctaController.getCtaClicksLogs);



module.exports = router;