import { google } from "googleapis";

async function queryGrokGsc() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "E:\\kaifa\\credentials\\gsc-service-account.json",
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"]
  });
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: "sc-domain:apivale.com",
    requestBody: {
      startDate: "2026-08-01",
      endDate: "2026-08-25",
      dimensionFilterGroups: [{
        filters: [{
          dimension: "page",
          operator: "contains",
          expression: "grok-bot-api-setup-pricing-troubleshooting"
        }]
      }],
      dimensions: ["query"],
      rowLimit: 50
    }
  });

  console.log("=== GROK BOT ARTICLE GSC STATS (Aug 1 - Aug 25) ===");
  console.log("Total unique queries ranking:", res.data.rows?.length || 0);

  let totalClicks = 0;
  let totalImpr = 0;

  for (const row of res.data.rows || []) {
    const q = row.keys?.[0];
    const clicks = row.clicks || 0;
    const impr = row.impressions || 0;
    totalClicks += clicks;
    totalImpr += impr;
    const ctr = ((row.ctr || 0) * 100).toFixed(2);
    const pos = (row.position || 0).toFixed(1);
    console.log(`- Query: "${q}" | Clicks: ${clicks} | Impr: ${impr} | CTR: ${ctr}% | Pos: ${pos}`);
  }

  console.log(`\nOverall: Total Clicks: ${totalClicks} | Total Impressions: ${totalImpr}`);
}

queryGrokGsc().catch(console.error);
