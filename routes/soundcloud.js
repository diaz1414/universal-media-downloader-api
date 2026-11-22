const express = require("express");
const router = express.Router();
const {
  handleSoundcloudDownload,
} = require("../controllers/soundcloudController");

router.get("/download", handleSoundcloudDownload);
router.get("/", handleSoundcloudDownload);

module.exports = router;
