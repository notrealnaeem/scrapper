const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

exports.scrapeData = async () => {
  const { data } = await axios.get("https://news.ycombinator.com/");
  const $ = cheerio.load(data);

  const items = [];

  $(".athing").each((i, el) => {
    if (i >= 20) return;

    const title = $(el).find(".titleline a").text();
    const link = $(el).find(".titleline a").attr("href");

    items.push({ title, link });
  });

  fs.writeFileSync("./data.json", JSON.stringify(items, null, 2));

  console.log("Scraped & saved!");
};
