const express = require("express");
const router = express.Router();

require("dotenv").config();

// Controllers
const tempController = require("../controllers/template/template");

router.get("/getTempData/", tempController.tempData);
router.get("/getTempImage/:id", tempController.getTempImage);
router.get("/getEmailTemp", tempController.getEmailTempData);
router.post("/addEmailTemp/:projectId/:id", tempController.emailTemp);
router.get("/getNewTempData/:id", tempController.getNewTempData);
router.get("/getViewMoreData/:id", tempController.getViewMoreData);

module.exports = router;
