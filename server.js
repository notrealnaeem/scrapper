const { Elysia } = require("elysia");
const { node: NodeAdapter } = require("@elysiajs/node");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { scrapeData } = require("./scrapper.js");

const dataPath = path.join(process.cwd(), "data.json");

const app = new Elysia({ adapter: NodeAdapter() })
  .get("/news", () => {
    const data = fs.existsSync(dataPath)
      ? JSON.parse(fs.readFileSync(dataPath, "utf-8") || "[]")
      : [];

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  })
  .get("/health", () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  });

cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled scraper...");
  await scrapeData();
});

(async () => {
  try {
    if (
      !fs.existsSync(dataPath) ||
      !fs.readFileSync(dataPath, "utf-8").trim()
    ) {
      console.log("Seeding initial scrape...");
      await scrapeData();
    }
  } catch (error) {
    console.error("Initial scrape failed:", error);
  }

  app.listen(4000);
  console.log("Elysia API listening on http://127.0.0.1:4000");
})();
