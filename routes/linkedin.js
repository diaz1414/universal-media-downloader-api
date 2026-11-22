const express = require("express");
const router = express.Router();
const { handleLinkedinDownload } = require("../controllers/linkedinController");

router.get("/download", handleLinkedinDownload);
router.get("/", handleLinkedinDownload);

module.exports = router;
