const express = require("express");
const router = express.Router();
const { handleThreadsDownload } = require("../controllers/threadsController");

router.get("/download", handleThreadsDownload);
router.get("/", handleThreadsDownload);

module.exports = router;
