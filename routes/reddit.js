const express = require("express");
const router = express.Router();
const { handleRedditDownload } = require("../controllers/redditController");

router.get("/download", handleRedditDownload);
router.get("/", handleRedditDownload);

module.exports = router;
