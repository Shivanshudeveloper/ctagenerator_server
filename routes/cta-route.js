const express = require('express');
const router = express.Router();

require('dotenv').config();


const ctaController = require('../controllers/cta');

router.get('/test', (req, res) => {
    res.send('Working');
});


// CTA

router.get('/ctaview', ctaController.viewCTA);

router.get('/:ctaPublicId', ctaController.viewCTA);


router.post('/create', ctaController.createCta);
router.put('/updatectafeedbacksetting/:ctaPublicId', ctaController.updateCtaFeedbackSetting);
router.post('/sendfeedback', ctaController.getFeedbackClient);
router.get('/getuserfeedbackinf/:clieIdLoc', ctaController.getUserFeedbackInfo);

router.get('/getpublicid/:ctaPublicId', ctaController.getCtabyPublicId);
router.delete('/removecta/:ctaPublicId', ctaController.deleteCta);
router.get('/getuserctaall/:organizationId', ctaController.getCtaforUser);
router.get('/getadminallctasystem', ctaController.getAllCtaInSystem);
router.put('/updatectadetails', ctaController.updateCtaDetails);
router.put('/updatectacounts/:ctaPublicId', ctaController.updateCtaCounts);
router.post('/getctaclicksdetails/:ctaPublicId', ctaController.getCtaClicksDetails);
router.get('/getallctaclickstats/:organizationId', ctaController.getAllCtaClickStats);
router.get('/getctaclickslogs/:ctaPublicId', ctaController.getCtaClicksLogs);
router.post('/savevideostats', ctaController.saveVideoStats);
router.post('/updatevideoviewcount', ctaController.updateVideoViewCount);
router.get('/getvideoviewcount/:ctaPublicId', ctaController.getVideoViewCount);
router.post('/savetotaltimespent', ctaController.saveTotalTimeSpent);
router.post('/savectacontact',ctaController.saveCtaContact);
router.get('/getctacontacts/:ctaPublicId', ctaController.getCtaContacts);
router.post('/saveTestimonial', ctaController.saveTestimonial);
router.get('/getTestimonials/:ctaPublicId', ctaController.getTestimonials);
router.get('/getAllContacts/:organizationId',ctaController.getAllContacts);
router.get('/totalctas/:organizationId', ctaController.totalCtas);
router.get('/getTopPerformingCTAs/:organizationId', ctaController.getTopPerformingCTAs);
router.get('/getDevicesInfo/:organizationId', ctaController.getDevicesInfo);
router.get('/getCtaViewsInDateRange/:organizationId', ctaController.getCtaViewsInDateRange);
router.get('/getCtaSourcesData/:ctaPublicId', ctaController.getCtaSourcesData);
router.get('/getTotalActiveCTAs/:organizationId', ctaController.getTotalActiveCTAs);
router.get('/getTotalPausedCTAs/:organizationId', ctaController.getTotalPausedCTAs);
router.post('/getctaclickslogsintimerange',ctaController.getCtaClicksLogsInTimeRange);
router.get('/getCtaTimeMap/:ctaPublicId', ctaController.getCtaTimeMap);
router.get('/getTotalCtaClicked/:organizationId', ctaController.getTotalCtaClicked);
router.post('/getTotalStatsInTimeRange/:organizationId', ctaController.getTotalStatsInTimeRange);
router.post('/getTopPerformingCtaInTimeRange/:organizationId', ctaController.getTopPerformingCtaInTimeRange);
router.post('/getAllCtaStatsInTimeRange/:organizationId', ctaController.getAllCtaStatsInTimeRange);
router.get('/sendMailToContacts/:ctaPublicId', ctaController.sendMailToContacts);
router.post('/getBotResponse/:ctaPublicId', ctaController.getBotResponse);
router.post('/getClicklogsInTimeRange/:ctaPublicId', ctaController.getClicklogsInTimeRange);
router.get('/getTotalMeetingBooked/:organizationId', ctaController.getTotalMeetingBooked);
router.get('/getTotalLinksClicked/:organizationId', ctaController.getTotalLinksClicked);
router.post('/getAllCtaDataInTimeRange', ctaController.getAllCtaDataInTimeRange);

module.exports = router;