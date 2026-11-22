const { twitterDownloader } = require("../services/twitterService");

async function handleTwitterDownload(req, res) {
  const { url } = req.query;

  if (!url) {
    return res
      .status(400).json({ success: false, creator: "Diaww", error: "Missing 'url' query parameter." });
  }

  try {
    const data = await twitterDownloader(url);
    res.json({ success: true, creator: "Diaww", data });
  } catch (error) {
    res.status(500).json({ success: false, creator: "Diaww", error: error.message   });
  }
}

module.exports = { handleTwitterDownload };
