const redditDownloader = require("../services/redditService");

async function handleRedditDownload(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, creator: "Diaww", error: "Missing 'url' query parameter." });
  }

  try {
    const result = await redditDownloader(url);
    res.json({ success: true, creator: "Diaww", data: result });
  } catch (err) {
    res.status(500).json({ success: false, creator: "Diaww", error: err.message   });
  }
}

module.exports = { handleRedditDownload };
