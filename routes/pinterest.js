const express = require("express");
const router = express.Router();
const {
  handlePinterestDownload,
} = require("../controllers/pinterestController");

router.get("/download", handlePinterestDownload);
router.get("/", handlePinterestDownload);

module.exports = router;
