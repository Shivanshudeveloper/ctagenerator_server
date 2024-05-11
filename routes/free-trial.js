const express = require("express");
const router = express.Router();

require("dotenv").config();

//Controllers
const freetrialController = require("../controllers/free_trial/freetrial");

// Free Trial Routes
// Email Verification Template Send
router.post("/sendfreetrial/1", freetrialController.sendFreeTrial1);
router.post("/sendfreetrial/2", freetrialController.sendFreeTrial2);
router.post("/sendfreetrial/3", freetrialController.sendFreeTrial3);
router.post("/sendfreetrial/4", freetrialController.sendFreeTrial4);
router.post("/sendfreetrial/5", freetrialController.sendFreeTrial5);
router.post("/sendfreetrial/6", freetrialController.sendFreeTrial6);
router.post("/sendfreetrial/7", freetrialController.sendFreeTrial7);
router.post("/sendfreetrial/8", freetrialController.sendFreeTrial8);
router.post("/sendfreetrial/9", freetrialController.sendFreeTrial9);
router.post("/sendfreetrial/10", freetrialController.sendFreeTrial10);
router.post("/sendfreetrial/11", freetrialController.sendFreeTrial11);
router.post("/sendfreetrial/12", freetrialController.sendFreeTrial12);
router.post("/sendfreetrial/13", freetrialController.sendFreeTrial13);
router.post("/sendfreetrial/14", freetrialController.sendFreeTrial14);
router.post("/sendfreetrial/15", freetrialController.sendFreeTrial15);
router.post("/sendfreetrial/16", freetrialController.sendFreeTrial16);
router.post("/sendfreetrial/17", freetrialController.sendFreeTrial17);
router.post("/sendfreetrial/18", freetrialController.sendFreeTrial18);
router.post("/sendfreetrial/19", freetrialController.sendFreeTrial19);

module.exports = router;
