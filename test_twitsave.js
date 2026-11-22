const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://twitter.com/SpaceX/status/2122368004298068305';

async function test() {
  const res = await axios.get('https://twitsave.com/info?url=' + encodeURIComponent(url));
  const $ = cheerio.load(res.data);
  console.log('Video poster:', $('video').attr('poster'));
  const html = res.data;
  const twimgMatches = html.match(/https?:\/\/[^"'\s]+\.twimg\.com[^"'\s]+/g);
  console.log('twimg matches:', twimgMatches);
}
test();
