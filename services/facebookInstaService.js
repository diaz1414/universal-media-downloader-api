const snapsave = require("metadownloader");

async function facebookInsta(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Missing or invalid URL provided");
  }

  try {
    const rawResult = await snapsave(url.trim());

    if (!rawResult) {
      throw new Error("No data returned from Instagram/Facebook scraper");
    }

    if (rawResult.status === false) {
      throw new Error(rawResult.msg || "Failed to fetch Instagram media. The post might be private.");
    }

    // rawResult.data is usually an array of { thumbnail, url }
    const items = Array.isArray(rawResult.data)
      ? rawResult.data
      : (rawResult.data ? [rawResult.data] : []);

    if (items.length === 0 && !rawResult.url && !rawResult.video_url) {
      throw new Error("No downloadable media streams found for this Instagram link");
    }

    const firstItem = items[0] || {};
    const thumbnail = firstItem.thumbnail || rawResult.thumbnail || "";

    const downloads = items.map((item, idx) => ({
      quality: items.length > 1 ? `Media #${idx + 1}` : "HD Video",
      url: item.url || item.download_url,
      thumbnail: item.thumbnail || thumbnail,
      format: "MP4",
      type: "video"
    }));

    return {
      status: true,
      title: "Instagram Media",
      author: "Instagram",
      thumbnail: thumbnail,
      downloads: downloads,
      media: items
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching Instagram/Facebook media");
  }
}

module.exports = facebookInsta;
