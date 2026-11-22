const express = require("express");
const router = express.Router();
const { handleDailymotionDownload } = require("../controllers/dailymotionController");

router.get("/download", handleDailymotionDownload);
router.get("/", handleDailymotionDownload);

module.exports = router;
