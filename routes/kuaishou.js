const express = require("express");
const router = express.Router();
const { handleKuaishouDownload } = require("../controllers/kuaishouController");

router.get("/download", handleKuaishouDownload);
router.get("/", handleKuaishouDownload);

module.exports = router;
