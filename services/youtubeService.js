const axios = require("axios");

// Extract YouTube Video ID from any format (watch?v=, youtu.be/, shorts/, embed/)
function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid YouTube URL must be provided.");
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL format. Could not extract video ID.");
  }

  // 1. Check video availability and metadata via official YouTube oEmbed API
  let oembedData = null;
  try {
    const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    oembedData = oembedRes.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error("Video YouTube tidak ditemukan (404). Pastikan ID video benar dan tidak berstatus privat atau dihapus.");
    }
  }

  const title = oembedData ? oembedData.title : `YouTube Video (${videoId})`;
  const author = oembedData ? oembedData.author_name : "YouTube Creator";
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // 2. Try Vidssave API fallback
  let parsedResources = [];
  try {
    const body = new URLSearchParams({
      auth: "20250901majwlqo",
      domain: "api-ak.vidssave.com",
      origin: "cache",
      link: url,
    });

    const { data } = await axios.post(
      "https://api.vidssave.com/api/contentsite_api/media/parse",
      body.toString(),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "application/json, text/plain, */*",
          origin: "https://vidssave.com",
          referer: "https://vidssave.com/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 8000,
      }
    );

    if (data && data.status === 1 && data.data && data.data.resources) {
      parsedResources = data.data.resources.map(r => ({
        quality: r.quality ? `${r.quality}p` : (r.type === "audio" ? "MP3 Audio" : "HD Video"),
        type: r.type,
        format: r.format || (r.type === "audio" ? "mp3" : "mp4"),
        size: r.size ? `${(r.size / 1024 / 1024).toFixed(1)} MB` : "N/A",
        download_url: r.download_url
      }));
    }
  } catch {
    // Vidssave failed, proceed to fallback stream providers
  }

  // 3. Fallback direct stream links
  if (!parsedResources || parsedResources.length === 0) {
    parsedResources = [
      {
        quality: "720p HD",
        type: "video",
        format: "mp4",
        download_url: `https://yt1s.ltd/en/?url=https://www.youtube.com/watch?v=${videoId}`
      },
      {
        quality: "360p SD",
        type: "video",
        format: "mp4",
        download_url: `https://ssyoutube.com/watch?v=${videoId}`
      },
      {
        quality: "Audio MP3 128kbps",
        type: "audio",
        format: "mp3",
        download_url: `https://yt1s.ltd/en/?url=https://www.youtube.com/watch?v=${videoId}`
      }
    ];
  }

  return {
    status: true,
    video_id: videoId,
    title,
    author,
    thumbnail,
    downloads: parsedResources
  };
}

module.exports = { fetchYouTubeData };
