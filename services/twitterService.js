const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Primary Twitter/X downloader via twitsave (direct video.twimg.com CDN links)
 */
async function fetchFromTwitsave(tweetUrl) {
  const cleanUrl = tweetUrl.split("/video/")[0].replace("x.com", "twitter.com");
  const endpoint = `https://twitsave.com/info?url=${encodeURIComponent(cleanUrl)}`;

  const res = await axios.get(endpoint, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://twitsave.com/",
    },
    timeout: 15000,
  });

  const $ = cheerio.load(res.data);
  const title = $("p.m-2").text().trim() || $("div.leading-tight").text().trim() || "Twitter / X Post";
  const thumbnail = $("video").attr("poster") || "";

  const downloads = [];
  $('a[href*="download"]').each((_, el) => {
    const rawHref = $(el).attr("href") || "";
    const text = $(el).text().trim();
    let directUrl = rawHref;

    if (rawHref.includes("download?file=")) {
      try {
        const b64 = rawHref.split("download?file=")[1]?.split("&")[0];
        if (b64) {
          directUrl = Buffer.from(decodeURIComponent(b64), "base64").toString("utf8");
        }
      } catch (err) {}
    }

    if (directUrl && directUrl.startsWith("http")) {
      const resMatch = text.match(/Resolution:\s*(\d+x\d+)/i);
      const resText = resMatch ? resMatch[1] : (text.replace(/\s+/g, " ") || "HD Video");
      downloads.push({
        quality: resText,
        title: title,
        url: directUrl,
        download_url: directUrl,
        format: "MP4",
        type: "video",
      });
    }
  });

  if (downloads.length === 0) {
    const errText = $(".text-center").first().text().trim();
    throw new Error(errText || "No video found on this tweet or account is private");
  }

  return {
    type: "video",
    title,
    thumbnail,
    downloads,
    videos: downloads.map((d) => ({ quality: d.quality, url: d.url })),
  };
}

/**
 * Fallback Twitter/X downloader via savetwitter
 */
async function fetchFromSavetwitter(tweetUrl) {
  const endpoint = "https://savetwitter.net/api/ajaxSearch";
  const form = new URLSearchParams({
    q: tweetUrl,
    lang: "en",
    cftoken: "",
  });

  const { data } = await axios.post(endpoint, form.toString(), {
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://savetwitter.net",
      referer: "https://savetwitter.net/en4",
      "x-requested-with": "XMLHttpRequest",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 15000,
  });

  if (!data || data.status !== "ok" || !data.data) {
    throw new Error(data?.msg || "Failed to fetch Twitter media");
  }

  const $ = cheerio.load(data.data);
  const tweetId = $("#TwitterId").val() || null;
  const title = $(".tw-middle h3").first().text().trim() || "Twitter Media";
  const duration = $(".tw-middle p").first().text().trim() || null;
  const thumbnail =
    $(".thumbnail img").attr("src") ||
    $(".download-items__thumb img").attr("src") ||
    null;

  const downloads = [];
  $(".tw-button-dl").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text();

    if (!href || !href.includes("dl.snapcdn.app")) return;

    if (text.includes("MP4")) {
      const qualityMatch = text.match(/\((\d+p)\)/);
      downloads.push({
        quality: qualityMatch ? qualityMatch[1] : "HD",
        title: title,
        url: href,
        download_url: href,
        format: "MP4",
        type: "video",
      });
    }
  });

  if (downloads.length === 0) {
    throw new Error("No downloadable video stream found");
  }

  return {
    type: "video",
    tweetId,
    title,
    duration,
    thumbnail,
    downloads,
    videos: downloads.map((d) => ({ quality: d.quality, url: d.url })),
  };
}

/**
 * Universal Twitter / X Downloader Service
 * @param {string} tweetUrl
 */
async function twitterDownloader(tweetUrl) {
  if (!tweetUrl) throw new Error("Tweet URL is required");

  try {
    return await fetchFromTwitsave(tweetUrl);
  } catch (err1) {
    try {
      return await fetchFromSavetwitter(tweetUrl);
    } catch (err2) {
      throw new Error(err1.message || err2.message || "Failed to fetch Twitter media");
    }
  }
}

module.exports = { twitterDownloader };
