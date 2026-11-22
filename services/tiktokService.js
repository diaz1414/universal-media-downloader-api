const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

async function fetchTikTokData(videoUrl) {
  try {
    const body = qs.stringify({
      id: videoUrl,
      locale: "en",
      tt: "dHl6Ylg4",
    });

    const res = await axios.post("https://ssstik.io/abc?url=dl", body, {
      headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        referer: "https://ssstik.io/en-1",
        "hx-request": "true",
        "hx-target": "target",
        "hx-trigger": "_gcaptcha_pt",
      },
    });

    const html = res.data;
    const $ = cheerio.load(html);

    const title =
      $("#avatar_and_text h2").text().trim() ||
      $("#avatarAndTextUsual h2").text().trim() ||
      $(".maintext").text().trim() ||
      $(".pure-u-18-24 p").first().text().trim() ||
      "TikTok Public Video";

    let thumbnail =
      $(".result_author").attr("src") ||
      $("img.result_author").attr("src") ||
      null;

    const bgImage = $("#mainpicture").css("background-image");
    if (!thumbnail && bgImage && bgImage.includes("url(")) {
      thumbnail = bgImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    }

    if (!thumbnail) {
      thumbnail = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80";
    }

    const downloads = [];

    // VIDEO / AUDIO DOWNLOADS
    $("a.download_link:not(.slide)").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      const url = $(el).attr("href");

      if (!url || url === "#") return;

      downloads.push({
        quality: text,
        type: text.toLowerCase().includes("mp3") || text.toLowerCase().includes("audio") ? "audio" : "video",
        format: text.toLowerCase().includes("mp3") || text.toLowerCase().includes("audio") ? "mp3" : "mp4",
        download_url: url
      });
    });

    // PHOTO / SLIDE DOWNLOADS
    $("a.download_link.slide").each((_, el) => {
      const url = $(el).attr("href");

      if (!url || url === "#") return;

      downloads.push({
        quality: "HD Image Slide",
        type: "image",
        format: "jpeg",
        download_url: url
      });
    });

    return {
      status: true,
      title,
      thumbnail,
      downloads,
    };
  } catch (error) {
    throw new Error(`SSSTik request failed: ${error.message}`);
  }
}

module.exports = { fetchTikTokData };
