const { fetchSnapchat } = require("../services/snapchatService");

async function handleSnapchat(req, res) {
  const { url } = req.query;
  if (!url) {
    return res
      .status(400).json({ success: false, creator: "Diaww", error: "Missing 'url' query parameter." });
  }

  try {
    const data = await fetchSnapchat(url);
    res.json({ success: true, creator: "Diaww", data });
  } catch (err) {
    res.status(500).json({ success: false, creator: "Diaww", error: err.message   });
  }
}

module.exports = { handleSnapchat };
