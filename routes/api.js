const express = require("express");
const router = express.Router();

// Import all platform services
const { fetchBlueskyMedia } = require("../services/blueskyService");
const { fetchCapcutData } = require("../services/capcutService");
const { fetchDailymotionData } = require("../services/dailymotionService");
const { fetchDouyinVideoInfo } = require("../services/douyinService");
const facebookInsta = require("../services/facebookInstaService");
const { scrapeKuaishou } = require("../services/kuaishouService");
const { fetchLinkedinData } = require("../services/linkedinService");
const { fetchPinterestMedia } = require("../services/pinterestService");
const redditDownloader = require("../services/redditService");
const { fetchSnapchat } = require("../services/snapchatService");
const { fetchSoundcloudData } = require("../services/soundcloudService");
const { fetchSpotify } = require("../services/spotifyService");
const { fetchTerabox } = require("../services/teraboxService");
const threadsDownloader = require("../services/threadsService");
const { fetchTikTokData } = require("../services/tiktokService");
const { fetchTumblrData } = require("../services/tumblrService");
const { twitterDownloader } = require("../services/twitterService");
const { fetchYouTubeData } = require("../services/youtubeService");

// Auto-detect platform from URL
function detectPlatform(url) {
  if (!url || typeof url !== "string") return null;
  const target = url.toLowerCase();

  if (target.includes("tiktok.com")) return "tiktok";
  if (target.includes("instagram.com") || target.includes("facebook.com") || target.includes("fb.watch")) return "meta";
  if (target.includes("youtube.com") || target.includes("youtu.be")) return "youtube";
  if (target.includes("terabox") || target.includes("1024tera") || target.includes("teraboxapp")) return "terabox";
  if (target.includes("twitter.com") || /(?:^|[\/\.])x\.com/.test(target)) return "twitter";
  if (target.includes("pinterest.com") || target.includes("pin.it")) return "pinterest";
  if (target.includes("spotify.com")) return "spotify";
  if (target.includes("capcut.com")) return "capcut";
  if (target.includes("reddit.com")) return "reddit";
  if (target.includes("threads.net")) return "threads";
  if (target.includes("soundcloud.com")) return "soundcloud";
  if (target.includes("snapchat.com")) return "snapchat";
  if (target.includes("dailymotion.com") || target.includes("dai.ly")) return "dailymotion";
  if (target.includes("bsky.app")) return "bluesky";
  if (target.includes("douyin.com")) return "douyin";
  if (target.includes("kuaishou.com")) return "kuaishou";
  if (target.includes("tumblr.com")) return "tumblr";
  if (target.includes("linkedin.com")) return "linkedin";

  return "unknown";
}

// Universal unified download endpoint
router.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      creator: "Diaww",
      error: "Missing 'url' query parameter. Example: /api/download?url=https://...",
    });
  }

  const platform = detectPlatform(url);

  try {
    let result;
    switch (platform) {
      case "tiktok":
        result = await fetchTikTokData(url);
        break;
      case "meta":
        result = await facebookInsta(url);
        break;
      case "youtube":
        result = await fetchYouTubeData(url);
        break;
      case "twitter":
        result = await twitterDownloader(url);
        break;
      case "pinterest":
        result = await fetchPinterestMedia(url);
        break;
      case "spotify":
        result = await fetchSpotify(url);
        break;
      case "capcut":
        result = await fetchCapcutData(url);
        break;
      case "reddit":
        result = await redditDownloader(url);
        break;
      case "threads":
        result = await threadsDownloader(url);
        break;
      case "soundcloud":
        result = await fetchSoundcloudData(url);
        break;
      case "terabox":
        result = await fetchTerabox(url);
        break;
      case "snapchat":
        result = await fetchSnapchat(url);
        break;
      case "dailymotion":
        result = await fetchDailymotionData(url);
        break;
      case "bluesky":
        result = await fetchBlueskyMedia(url);
        break;
      case "douyin":
        result = await fetchDouyinVideoInfo(url);
        break;
      case "kuaishou":
        result = await scrapeKuaishou(url);
        break;
      case "tumblr":
        result = await fetchTumblrData(url);
        break;
      case "linkedin":
        result = await fetchLinkedinData(url);
        break;
      default:
        // Try fallback with metadownloader
        try {
          result = await facebookInsta(url);
        } catch {
          return res.status(400).json({
            success: false,
            creator: "Diaww",
            error: "Unsupported platform or invalid URL format.",
          });
        }
    }

    return res.json({
      success: true,
      creator: "Diaww",
      platform: platform || "auto",
      source_url: url,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      creator: "Diaww",
      platform: platform || "unknown",
      error: error.message || "Failed to process media download request.",
    });
  }
});

// List all supported platforms & endpoints
router.get("/endpoints", (req, res) => {
  res.json({
    success: true,
    creator: "Diaww",
    service: "Diaww Universal Media API",
    total_platforms: 18,
    universal_endpoint: "/api/download?url=",
    platform_endpoints: [
      "/api/bluesky/download?url=",
      "/api/capcut/download?url=",
      "/api/dailymotion/download?url=",
      "/api/douyin/download?url=",
      "/api/kuaishou/download?url=",
      "/api/linkedin/download?url=",
      "/api/meta/download?url=",
      "/api/pinterest/download?url=",
      "/api/reddit/download?url=",
      "/api/snapchat/download?url=",
      "/api/soundcloud/download?url=",
      "/api/spotify/download?url=",
      "/api/terabox/download?url=",
      "/api/threads/download?url=",
      "/api/tiktok/download?url=",
      "/api/tumblr/download?url=",
      "/api/twitter/download?url=",
      "/api/youtube/download?url=",
    ],
  });
});

module.exports = router;
