const express = require("express");
const router = express.Router();
const { handleTumblrDownload } = require("../controllers/tumblrController");

router.get("/download", handleTumblrDownload);
router.get("/", handleTumblrDownload);

module.exports = router;
