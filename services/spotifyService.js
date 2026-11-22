const axios = require("axios");

// Sanitize Spotify URL by stripping query parameters like ?si=...
function cleanSpotifyUrl(url) {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

async function fetchSpotify(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid Spotify URL must be provided.");
  }

  const cleanUrl = cleanSpotifyUrl(url);

  try {
    const res = await axios.post(
      "https://musicfab.io/api/spotify",
      { url: cleanUrl },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer: "https://musicfab.io/",
          Origin: "https://musicfab.io",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000,
        validateStatus: (status) => status < 500,
      },
    );

    if (res.status >= 400) {
      throw new Error(`MusicFab API error: ${res.status}`);
    }

    const rawData = res.data || {};
    const data = rawData.data || rawData;
    const metadata = data.metadata || data.track || {};

    let audioDownloadUrl = null;
    const rawDownload = metadata.download || metadata.downloadUrl;

    if (rawDownload) {
      // Use local streaming proxy endpoint if starting with /api/spotify/audio
      if (rawDownload.startsWith("/api/spotify/audio")) {
        audioDownloadUrl = rawDownload;
      } else {
        const pathSuffix = rawDownload.endsWith('/') ? rawDownload : `${rawDownload}/`;
        audioDownloadUrl = `https://musicfab.io${pathSuffix}`;
      }
    }

    const title = metadata.name || metadata.title || "Spotify Track";
    const author = metadata.artist || "Spotify Artist";
    const thumbnail = metadata.image || metadata.cover || "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80";
    const duration = metadata.duration || "";

    const downloads = [];
    if (audioDownloadUrl) {
      downloads.push({
        quality: `Audio MP3 320kbps (${duration || "Full"})`,
        type: "audio",
        format: metadata.extension || "mp3",
        download_url: audioDownloadUrl,
      });
    }

    return {
      status: true,
      title,
      author,
      album: metadata.album || "",
      duration,
      thumbnail,
      downloads,
      metadata,
    };
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout from MusicFab API");
    }

    if (err.response) {
      throw new Error(
        `MusicFab API error: ${err.response.status} ${err.response.statusText}`,
      );
    }

    if (err.request) {
      throw new Error("No response received from MusicFab API");
    }

    throw new Error(`Request failed: ${err.message}`);
  }
}

module.exports = { fetchSpotify };
