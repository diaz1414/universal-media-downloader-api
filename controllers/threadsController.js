const threadsDownloader = require("../services/threadsService");

async function handleThreadsDownload(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, creator: "Diaww", error: "Missing 'url' query parameter." });
  }

  try {
    const result = await threadsDownloader(url);
    res.json({ success: true, creator: "Diaww", data: result });
  } catch (err) {
    res.status(500).json({ success: false, creator: "Diaww", error: err.message   });
  }
}

module.exports = { handleThreadsDownload };
