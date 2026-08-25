import { google } from "googleapis";
import fs from "fs";

async function analyzeSurge() {
  const keyPath = "E:\\kaifa\\credentials\\gsc-service-account.json";
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"]
  });

  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = "sc-domain:apivale.com";

  console.log("=== 📈 1. DAILY TRAFFIC TREND (2026-08-10 ~ 2026-08-24) ===");
  const dailyRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: "2026-08-10",
      endDate: "2026-08-24",
      dimensions: ["date"],
      rowLimit: 20
    }
  });

  for (const row of dailyRes.data.rows || []) {
    const date = row.keys?.[0];
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = ((row.ctr || 0) * 100).toFixed(2);
    const pos = (row.position || 0).toFixed(1);
    console.log(`[${date}] Clicks: ${clicks} | Impr: ${impressions} | CTR: ${ctr}% | Avg Pos: ${pos}`);
  }

  console.log("\n=== 🎯 2. TOP QUERIES ON AUGUST 23 (PEAK DAY) ===");
  const queryRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: "2026-08-23",
      endDate: "2026-08-23",
      dimensions: ["query"],
      rowLimit: 25
    }
  });

  for (const row of queryRes.data.rows || []) {
    const q = row.keys?.[0];
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = ((row.ctr || 0) * 100).toFixed(2);
    const pos = (row.position || 0).toFixed(1);
    console.log(`- Query: "${q}" | Clicks: ${clicks} | Impr: ${impressions} | CTR: ${ctr}% | Pos: ${pos}`);
  }

  console.log("\n=== 📄 3. TOP LANDING PAGES (2026-08-14 ~ 2026-08-24) ===");
  const pageRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: "2026-08-14",
      endDate: "2026-08-24",
      dimensions: ["page"],
      rowLimit: 15
    }
  });

  for (const row of pageRes.data.rows || []) {
    const p = row.keys?.[0];
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = ((row.ctr || 0) * 100).toFixed(2);
    const pos = (row.position || 0).toFixed(1);
    console.log(`- Page: ${p} | Clicks: ${clicks} | Impr: ${impressions} | CTR: ${ctr}% | Pos: ${pos}`);
  }
}

analyzeSurge().catch(console.error);
