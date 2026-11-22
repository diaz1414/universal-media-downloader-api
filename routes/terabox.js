const express = require("express");
const router = express.Router();
const { handleTeraboxDownload } = require("../controllers/teraboxController");

router.get("/download", handleTeraboxDownload);
router.get("/", handleTeraboxDownload);

module.exports = router;
