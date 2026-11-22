const axios = require("axios");
const cheerio = require("cheerio");

async function threadsDownloader(postUrl) {
  if (!postUrl) throw new Error("Threads URL is required");

  const endpoint = "https://lovethreads.net/api/ajaxSearch";

  const form = new URLSearchParams({
    q: postUrl.trim(),
    t: "media",
    lang: "en",
  });

  const { data } = await axios.post(endpoint, form.toString(), {
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://lovethreads.net",
      referer: "https://lovethreads.net/en",
      "x-requested-with": "XMLHttpRequest",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 15000,
  });

  if (!data || data.status !== "ok" || !data.data) {
    throw new Error(data?.mess || "Failed to fetch Threads media");
  }

  const $ = cheerio.load(data.data);

  const photos = [];
  const videos = [];

  $(".download-box > li").each((_, li) => {
    const item = $(li);

    /* ───────────── PHOTO ───────────── */
    if (item.find(".icon-dlimage").length) {
      const thumbnail = item
        .find(".download-items__thumb img")
        .attr("src");

      const variants = [];

      item.find(".photo-option option").each((_, opt) => {
        const url = $(opt).attr("value");
        const label = $(opt).text().trim();

        if (!url || !label.includes("x")) return;

        const [width, height] = label.split("x").map(Number);

        variants.push({
          resolution: label,
          width,
          height,
          url,
        });
      });

      variants.sort(
        (a, b) => b.width * b.height - a.width * a.height
      );

      const downloadUrl = variants[0]?.url || item.find('a[href*="dl.snapcdn.app"]').attr("href") || thumbnail;

      photos.push({
        index: photos.length + 1,
        thumbnail,
        downloadUrl,
        variants,
      });
    }

    /* ───────────── VIDEO ───────────── */
    if (item.find(".icon-dlvideo").length) {
      const thumbnail = item
        .find(".download-items__thumb img")
        .attr("src");

      const videoUrl = item
        .find('a[title="Download Video"], a[href*="dl.snapcdn.app"]')
        .attr("href");

      if (!videoUrl) return;

      videos.push({
        index: videos.length + 1,
        thumbnail,
        url: videoUrl,
        format: "mp4",
      });
    }
  });

  const downloads = [];

  videos.forEach((v, idx) => {
    downloads.push({
      quality: videos.length > 1 ? `Video #${idx + 1}` : "HD Video",
      title: `Threads Video ${idx + 1}`,
      url: v.url,
      download_url: v.url,
      format: "MP4",
      type: "video",
    });
  });

  photos.forEach((p, idx) => {
    downloads.push({
      quality: photos.length > 1 ? `Photo #${idx + 1}` : "HD Photo",
      title: `Threads Photo ${idx + 1}`,
      url: p.downloadUrl || p.thumbnail,
      download_url: p.downloadUrl || p.thumbnail,
      format: "JPG",
      type: "photo",
    });
  });

  const thumbnail =
    videos[0]?.thumbnail ||
    photos[0]?.thumbnail ||
    "";

  return {
    status: true,
    platform: "threads",
    title: "Threads Post Media",
    author: "Threads",
    thumbnail,
    photoCount: photos.length,
    videoCount: videos.length,
    downloads,
    photos,
    videos,
  };
}

module.exports = threadsDownloader;
