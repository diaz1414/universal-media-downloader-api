# 🚀 Diaww Media Engine (Universal Downloader REST API)

<p align="center">
  <img src="public/img/diaww_logo.jpg" alt="Diaww Media API Logo" width="180" style="border-radius: 18px; border: 3px solid #0F172A; box-shadow: 4px 4px 0px #0F172A;" />
</p>

<p align="center">
  <b>High-Performance, Free & Open-Source Universal Media Downloader REST API & Neo-Brutalism Developer Hub</b><br>
  <i>Extract video, audio, and image streams from 18+ social media platforms with a single unified endpoint.</i>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-0F172A.svg?style=for-the-badge" alt="MIT License"></a>
  <a href="#nodejs"><img src="https://img.shields.io/badge/Node.js-v18+-22c55e.svg?style=for-the-badge" alt="Node.js"></a>
  <a href="#express"><img src="https://img.shields.io/badge/Express-4.x-facc15.svg?style=for-the-badge&logoColor=0F172A" alt="Express"></a>
  <a href="#ui"><img src="https://img.shields.io/badge/Neo--Brutalism-UI%2FUX-0F172A.svg?style=for-the-badge" alt="Neo Brutalism"></a>
  <a href="#platforms"><img src="https://img.shields.io/badge/Platforms-18+-22c55e.svg?style=for-the-badge" alt="18+ Platforms"></a>
</p>

---

## 🌟 Key Highlights

- ⚡ **18+ Supported Platforms**: TikTok, Instagram, YouTube, Twitter/X, Facebook, Spotify, Pinterest, Threads, Reddit, CapCut, SoundCloud, TeraBox, Snapchat, Dailymotion, Bluesky, Douyin, Kuaishou, Tumblr, and LinkedIn.
- 🎯 **Universal Auto-Detect Endpoint**: Call `/api/download?url=...` with any media link; the engine automatically identifies the platform and dispatches the request to the matching scraper service.
- 🔀 **Dedicated Platform Routes**: Individual endpoints such as `/api/tiktok/download`, `/api/meta/download`, and `/api/youtube/download` remain fully accessible.
- 🎨 **Eye-Friendly Neo-Brutalism UI**: Built with a calm palette (Warm Yellow, Vivid Green, Jet Black, and Crisp White), clean typography, tactile buttons, and hard drop shadows.
- 🌐 **Instant Bilingual Documentation**: Seamlessly switch between **English** and **Indonesian** with one click—no page reload required.
- 🧪 **Interactive Live API Playground**: Test public links in real-time directly inside your browser and inspect live JSON streams.
- 💻 **Multi-Language Code Snippets**: Copy-paste integration snippets ready for **cURL**, **JavaScript (Fetch)**, **Python**, and **PHP**.
- 📱 **Mobile-First Responsive Navbar**: Features a smooth hamburger drawer menu for mobile developers.
- ☕ **Integrated Donation Hub**: Pre-configured support cards for **Saweria**, **BagiBagi**, and **Ko-fi**.

---

## 📱 Supported Platforms

| Platform | Endpoint | Supported Media |
| :--- | :--- | :--- |
| **TikTok** | `/api/tiktok/download` | HD Video (No Watermark), MP3 Audio |
| **Instagram & Facebook (Meta)** | `/api/meta/download` | Reels, Posts, Stories, HD Videos |
| **YouTube** | `/api/youtube/download` | Videos, Shorts, Audio Extraction |
| **Twitter / X** | `/api/twitter/download` | Tweet Videos, MP4 Streams |
| **Spotify** | `/api/spotify/download` | Track Metadata, Preview Streams |
| **Pinterest** | `/api/pinterest/download` | High-Res Pins, Images, MP4 Videos |
| **Threads** | `/api/threads/download` | Video and Image Posts |
| **CapCut** | `/api/capcut/download` | Template Videos, Raw MP4 |
| **Reddit** | `/api/reddit/download` | Reddit Video Streams (v.redd.it) |
| **SoundCloud** | `/api/soundcloud/download` | Audio Tracks |
| **TeraBox** | `/api/terabox/download` | Cloud File Streams |
| **Snapchat** | `/api/snapchat/download` | Public Spotlight Videos |
| **Dailymotion** | `/api/dailymotion/download` | Video Streams |
| **Bluesky** | `/api/bluesky/download` | Post Images and Videos |
| **Douyin** | `/api/douyin/download` | HD Video Streams |
| **Kuaishou** | `/api/kuaishou/download` | Video Streams |
| **Tumblr** | `/api/tumblr/download` | Post Media |
| **LinkedIn** | `/api/linkedin/download` | Feed Video Posts |

---

## 📖 API Documentation

### 1. Super Universal Endpoint (Recommended)

Automatically detects any valid URL from the 18+ supported platforms.

- **Method**: `GET`
- **Route**: `/api/download`
- **Query Parameter**:
  - `url` *(string, required)*: The public media URL.

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/download?url=https://www.tiktok.com/@tiktok/video/7106594312292453675" \
  -H "Accept: application/json"
```

#### Example Response:
```json
{
  "success": true,
  "creator": "Diaww",
  "platform": "tiktok",
  "source_url": "https://www.tiktok.com/@tiktok/video/7106594312292453675",
  "data": {
    "status": true,
    "title": "TikTok Public Video",
    "thumbnail": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80",
    "downloads": [
      {
        "quality": "Without watermark",
        "type": "video",
        "format": "mp4",
        "download_url": "https://tikcdn.io/ssstik/7106594312292453675?st=..."
      },
      {
        "quality": "Download MP3",
        "type": "audio",
        "format": "mp3",
        "download_url": "https://tikcdn.io/ssstik/m/..."
      }
    ]
  }
}
```

### 2. Dedicated Platform Endpoints

You can also target individual platform routes directly:
```bash
# TikTok
curl -X GET "http://localhost:3000/api/tiktok/download?url=https://www.tiktok.com/@tiktok/video/7106594312292453675"

# Instagram / Facebook
curl -X GET "http://localhost:3000/api/meta/download?url=https://www.instagram.com/reel/..."

# YouTube
curl -X GET "http://localhost:3000/api/youtube/download?url=https://www.youtube.com/watch?v=..."
```

### 3. Service Health Check
```bash
curl -X GET "http://localhost:3000/api/health"
```

---

## 🛠️ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `pnpm` / `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/diaww-media-api.git
cd diaww-media-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=3000
NODE_ENV=development
```

### 4. Run the Server
```bash
# Production mode
npm start

# Development mode with hot-reload
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

---

## 💻 Code Integration Examples

### JavaScript (Fetch API)
```javascript
const targetUrl = "https://www.tiktok.com/@tiktok/video/7106594312292453675";

fetch(`http://localhost:3000/api/download?url=${encodeURIComponent(targetUrl)}`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Python 3 (Requests)
```python
import requests

url = "http://localhost:3000/api/download"
params = {
    "url": "https://www.tiktok.com/@tiktok/video/7106594312292453675"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

### PHP
```php
<?php
$targetUrl = urlencode("https://www.tiktok.com/@tiktok/video/7106594312292453675");
$endpoint = "http://localhost:3000/api/download?url=" . $targetUrl;

$response = file_get_contents($endpoint);
$data = json_decode($response, true);

print_r($data);
?>
```

---

## 🚀 Cloud Deployment Guide

### Deploying on Render / Railway
1. Push your repository to GitHub.
2. Link your repository in [Render](https://render.com) or [Railway](https://railway.app).
3. Set the **Build Command**: `npm install`
4. Set the **Start Command**: `npm start`
5. Configure the environment variable: `PORT=3000`

### Deploying on a Linux VPS (Ubuntu / Debian + PM2)
```bash
git clone https://github.com/your-username/diaww-media-api.git
cd diaww-media-api
npm install
npm install -g pm2
pm2 start server.js --name "diaww-media-api"
pm2 save
pm2 startup
```

---

## 💖 Support the Developer (Donations)

If this project helps your workflow, product, or application, consider supporting its maintenance and hosting costs:

- 🇮🇩 **Saweria** (QRIS, GoPay, OVO, Dana): [saweria.co/diaw14](https://saweria.co/diaw14)
- 🇮🇩 **BagiBagi**: [bagibagi.co/Diaww](https://bagibagi.co/Diaww)
- 🌍 **Ko-fi** (PayPal, Credit/Debit Cards): [ko-fi.com/diaww14](https://ko-fi.com/diaww14)

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE). You are free to modify, distribute, and integrate it into personal and commercial projects.
