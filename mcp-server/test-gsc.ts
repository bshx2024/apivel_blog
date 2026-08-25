import { google } from "googleapis";
import fs from "fs";

async function testGSC() {
  console.log("--- 🔍 Testing Google Search Console API Connection ---");

  const keyPath = "E:\\kaifa\\credentials\\gsc-service-account.json";
  if (!fs.existsSync(keyPath)) {
    console.error("❌ Key file not found:", keyPath);
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"]
  });

  const searchconsole = google.searchconsole({ version: "v1", auth });

  console.log("1. Fetching verified sites list...");
  try {
    const sitesRes = await searchconsole.sites.list();
    const siteEntries = sitesRes.data.siteEntry || [];
    console.log(`✅ Success! Verified sites accessible by service account: ${siteEntries.length}`);
    for (const s of siteEntries) {
      console.log(`   - Site: ${s.siteUrl} (Permission: ${s.permissionLevel})`);
    }

    const primarySite = siteEntries[0]?.siteUrl || "sc-domain:apivale.com";
    console.log(`\n2. Querying Search Analytics performance for '${primarySite}'...`);

    // GSC data usually has 2-3 days latency. Query recent 28 days
    const today = new Date();
    const end = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    const start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    const analyticsRes = await searchconsole.searchanalytics.query({
      siteUrl: primarySite,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 15
      }
    });

    const rows = analyticsRes.data.rows || [];
    console.log(`✅ Success! Retrieved ${rows.length} top performing search queries:`);
    for (const r of rows.slice(0, 10)) {
      const q = r.keys?.[0];
      const clicks = r.clicks || 0;
      const impressions = r.impressions || 0;
      const ctr = ((r.ctr || 0) * 100).toFixed(2);
      const pos = (r.position || 0).toFixed(1);
      console.log(`   * Query: "${q}" | Clicks: ${clicks} | Impr: ${impressions} | CTR: ${ctr}% | Pos: ${pos}`);
    }

    console.log("\n🎉 Google Search Console API is 100% WORKING and CONNECTED!");
  } catch (err: any) {
    console.error("❌ GSC API Request failed:", err?.message || err);
    if (err?.errors) {
      console.error("   Details:", JSON.stringify(err.errors, null, 2));
    }
  }
}

testGSC();
