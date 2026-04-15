const cron = require("node-cron");
const { scrapeData } = require("./scrapper.js");

cron.schedule("0 * * * *", async () => {
  console.log("Running scraper...");
  await scrapeData();
});
