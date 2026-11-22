const express = require("express");
const router = express.Router();
const axios = require("axios");
const { handleSpotifyDownload } = require("../controllers/spotifyController");

router.get("/download", handleSpotifyDownload);
router.get("/", handleSpotifyDownload);

// Proxy audio streaming endpoint to download MP3 directly
router.get(["/audio/:id", "/audio/:id/"], async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, creator: "Diaww", error: "Missing audio ID parameter." });
  }

  try {
    const targetUrl = `https://musicfab.io/api/spotify/audio/${id}/`;
    const response = await axios({
      method: "GET",
      url: targetUrl,
      headers: {
        Referer: "https://musicfab.io/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "stream",
      maxRedirects: 5,
      timeout: 20000,
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename="spotify_track_${id.slice(0, 8)}.mp3"`);
    response.data.pipe(res);
  } catch (err) {
    console.error("Spotify audio proxy error:", err.message);
    res.status(500).json({ success: false, creator: "Diaww", error: "Failed to stream Spotify audio." });
  }
});

module.exports = router;
