const express = require('express');
const router = express.Router();

require('dotenv').config();

//Controllers
const featureController = require('../controllers/feature/featureemail');


// Sign Up Emails Routes
// Email Verification Template Send
router.post('/sendfeatureemail/1', featureController.sendFeatureEmail1);
router.post('/sendfeatureemail/2', featureController.sendFeatureEmail2);
router.post('/sendfeatureemail/3', featureController.sendFeatureEmail3);
router.post('/sendfeatureemail/4', featureController.sendFeatureEmail4);
router.post('/sendfeatureemail/5', featureController.sendFeatureEmail5);
router.post('/sendfeatureemail/6', featureController.sendFeatureEmail6);
router.post('/sendfeatureemail/7', featureController.sendFeatureEmail7);
router.post('/sendfeatureemail/8', featureController.sendFeatureEmail8);
router.post('/sendfeatureemail/9', featureController.sendFeatureEmail9);
router.post('/sendfeatureemail/10', featureController.sendFeatureEmail10);
router.post('/sendfeatureemail/11', featureController.sendFeatureEmail11);
router.post('/sendfeatureemail/12', featureController.sendFeatureEmail12);
router.post('/sendfeatureemail/13', featureController.sendFeatureEmail13);
router.post('/sendfeatureemail/14', featureController.sendFeatureEmail14);
router.post('/sendfeatureemail/15', featureController.sendFeatureEmail15);
router.post('/sendfeatureemail/16', featureController.sendFeatureEmail16);
router.post('/sendfeatureemail/17', featureController.sendFeatureEmail17);
router.post('/sendfeatureemail/18', featureController.sendFeatureEmail18);
router.post('/sendfeatureemail/19', featureController.sendFeatureEmail19);
router.post('/sendfeatureemail/20', featureController.sendFeatureEmail20);
router.post('/sendfeatureemail/21', featureController.sendFeatureEmail21);
router.post('/sendfeatureemail/22', featureController.sendFeatureEmail22);
router.post('/sendfeatureemail/23', featureController.sendFeatureEmail23);
router.post('/sendfeatureemail/24', featureController.sendFeatureEmail24);
router.post('/sendfeatureemail/25', featureController.sendFeatureEmail25);
router.post('/sendfeatureemail/26', featureController.sendFeatureEmail26);
router.post('/sendfeatureemail/27', featureController.sendFeatureEmail27);
router.post('/sendfeatureemail/28', featureController.sendFeatureEmail28);
router.post('/sendfeatureemail/29', featureController.sendFeatureEmail29);
router.post('/sendfeatureemail/30', featureController.sendFeatureEmail30);
router.post('/sendfeatureemail/31', featureController.sendFeatureEmail31);
router.post('/sendfeatureemail/32', featureController.sendFeatureEmail32);
router.post('/sendfeatureemail/33', featureController.sendFeatureEmail33);
router.post('/sendfeatureemail/34', featureController.sendFeatureEmail34);
router.post('/sendfeatureemail/35', featureController.sendFeatureEmail35);
router.post('/sendfeatureemail/36', featureController.sendFeatureEmail36);
router.post('/sendfeatureemail/37', featureController.sendFeatureEmail37);
router.post('/sendfeatureemail/38', featureController.sendFeatureEmail38);
router.post('/sendfeatureemail/39', featureController.sendFeatureEmail39);
router.post('/sendfeatureemail/40', featureController.sendFeatureEmail40);
router.post('/sendfeatureemail/41', featureController.sendFeatureEmail41);
router.post('/sendfeatureemail/42', featureController.sendFeatureEmail42);
router.post('/sendfeatureemail/43', featureController.sendFeatureEmail43);
router.post('/sendfeatureemail/44', featureController.sendFeatureEmail44);
router.post('/sendfeatureemail/45', featureController.sendFeatureEmail45);
router.post('/sendfeatureemail/46', featureController.sendFeatureEmail46);
router.post('/sendfeatureemail/47', featureController.sendFeatureEmail47);
router.post('/sendfeatureemail/48', featureController.sendFeatureEmail48);
router.post('/sendfeatureemail/49', featureController.sendFeatureEmail49);
router.post('/sendfeatureemail/50', featureController.sendFeatureEmail50);
router.post('/sendfeatureemail/51', featureController.sendFeatureEmail51);

module.exports = router;