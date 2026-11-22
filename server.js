require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const os = require("os");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.set("json spaces", 2);
app.use(morgan("dev"));

// Serve static assets for the Neo-Brutalism documentation frontend
app.use(express.static(path.join(__dirname, "public")));

// Universal Downloader & Endpoint Directory Router
app.use("/api", require("./routes/api"));

// Dedicated Platform Routes (Preserving full compatibility with universalDownloader)
app.use("/api/bluesky", require("./routes/bluesky"));
app.use("/api/capcut", require("./routes/capcut"));
app.use("/api/dailymotion", require("./routes/dailymotion"));
app.use("/api/douyin", require("./routes/douyin"));
app.use("/api/kuaishou", require("./routes/kuaishou"));
app.use("/api/linkedin", require("./routes/linkedin"));
app.use("/api/meta", require("./routes/facebookInsta"));
app.use("/api/pinterest", require("./routes/pinterest"));
app.use("/api/reddit", require("./routes/reddit"));
app.use("/api/spotify", require("./routes/spotify"));
app.use("/api/snapchat", require("./routes/snapchat"));
app.use("/api/soundcloud", require("./routes/soundcloud"));
app.use("/api/terabox", require("./routes/terabox"));
app.use("/api/threads", require("./routes/threads"));
app.use("/api/tiktok", require("./routes/tiktok"));
app.use("/api/tumblr", require("./routes/tumblr"));
app.use("/api/twitter", require("./routes/twitter"));
app.use("/api/youtube", require("./routes/youtube"));

// Helper function to format seconds into clear human-readable uptime
function formatHumanUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
}

// Comprehensive Health check endpoint
app.get("/api/health", (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const mem = process.memoryUsage();

  res.status(200).json({
    success: true,
    service: "Diaww Media Engine & REST API",
    status: "online",
    creator: "Diaww (diaz1414)",
    uptime: {
      human: formatHumanUptime(uptimeSeconds),
      seconds: uptimeSeconds,
      started_at: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
    },
    memory: {
      rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
      heap_used: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heap_total: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      system_free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      system_total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    },
    system: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      cpu_cores: os.cpus().length,
      environment: process.env.NODE_ENV || "production",
    },
    supported_platforms: {
      count: 18,
      platforms: [
        "tiktok",
        "instagram",
        "youtube",
        "twitter",
        "facebook",
        "spotify",
        "terabox",
        "threads",
        "pinterest",
        "capcut",
        "reddit",
        "snapchat",
        "soundcloud",
        "douyin",
        "kuaishou",
        "dailymotion",
        "linkedin",
        "bluesky",
        "tumblr",
      ],
    },
    repository: "https://github.com/diaz1414/universal-media-downloader-api",
    timestamp: new Date().toISOString(),
  });
});

// Root fallback: serve the Neo-Brutalism landing page & interactive docs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    creator: "Diaww",
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Diaww Media Engine running at port ${PORT} (0.0.0.0)`);
});
