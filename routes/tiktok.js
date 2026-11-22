const express = require("express");
const router = express.Router();
const { handleTikTokDownload } = require("../controllers/tiktokController");

router.get("/download", handleTikTokDownload);
router.get("/", handleTikTokDownload);

module.exports = router;
