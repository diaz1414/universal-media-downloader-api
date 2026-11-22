const express = require("express");
const router = express.Router();
const { handleBlueskyDownload } = require("../controllers/blueskyController");

router.get("/download", handleBlueskyDownload);
router.get("/", handleBlueskyDownload);

module.exports = router;
