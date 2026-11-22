const axios = require("axios");
const crypto = require("crypto");

/**
 * Fetch media files and high-speed direct download links from TeraBox share URLs
 * Supports: terabox.com, 1024terabox.com, 1024tera.com, teraboxapp.com, terabox.fun, etc.
 * @param {string} teraboxUrl
 * @returns {Promise<Object>}
 */
async function fetchTerabox(teraboxUrl) {
  if (!teraboxUrl || typeof teraboxUrl !== "string") {
    throw new Error("Invalid TeraBox URL provided");
  }

  const cleanUrl = teraboxUrl.trim();

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const secret = "T9do@SM1?xGn5";
    const token = crypto
      .createHash("md5")
      .update(secret + timestamp + "/api/stream.php")
      .digest("hex");

    const endpoint = `https://playterabox.com/api/fetch-video?token=${token}&t=${timestamp}`;

    const res = await axios.post(
      endpoint,
      {
        url: cleanUrl,
        provider: "teraboxdl",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Origin: "https://playterabox.com",
          Referer: "https://playterabox.com/",
        },
        timeout: 30000,
      }
    );

    const data = res.data;
    if (!data || data.status !== "success" || !Array.isArray(data.list) || data.list.length === 0) {
      const errMsg = data?.message || data?.error || "Failed to extract TeraBox files or link is invalid/expired";
      throw new Error(errMsg);
    }

    const firstItem = data.list[0];
    const thumbnail =
      firstItem?.thumbnail ||
      firstItem?.thumbs?.url3 ||
      firstItem?.thumbs?.url2 ||
      firstItem?.thumbs?.url1 ||
      "";

    const downloads = data.list.map((item, index) => {
      const ext = item.server_filename?.split(".").pop()?.toUpperCase() || "FILE";
      const isVideo = item.category === 1 || ["MP4", "MKV", "AVI", "MOV", "WEBM", "FLV"].includes(ext);
      const isImage = item.category === 3 || ["PNG", "JPG", "JPEG", "WEBP", "GIF", "SVG", "BMP"].includes(ext);
      const isAudio = item.category === 2 || ["MP3", "WAV", "FLAC", "AAC", "OGG", "M4A"].includes(ext);
      const fileType = isVideo ? "video" : (isImage ? "image" : (isAudio ? "audio" : "file"));

      return {
        quality: item.quality || (data.list.length > 1 ? `File #${index + 1}` : (isImage ? "Original PNG/JPG" : "HD Fast")),
        title: item.server_filename || item.name || `File ${index + 1}`,
        size: item.size_formatted || item.formatted_size || null,
        size_bytes: item.size || null,
        format: ext,
        type: fileType,
        download_url: item.download_link || item.fast_download_link || item.direct_link,
        fast_download_url: item.fast_download_link || item.download_link,
        stream_url: item.stream_url ? `https://playterabox.com${item.stream_url}` : null,
      };
    });

    return {
      status: true,
      title: data.title || firstItem?.server_filename || "TeraBox Shared Media",
      total_size: data.total_size || firstItem?.size_formatted || null,
      total_size_bytes: data.total_size_bytes || firstItem?.size || 0,
      files_count: data.list.length,
      author: "TeraBox Share",
      thumbnail: thumbnail,
      downloads: downloads,
      list: data.list,
    };
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message || "Failed to resolve TeraBox link");
  }
}

module.exports = { fetchTerabox };
