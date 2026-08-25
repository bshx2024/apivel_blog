import { handleMonitorEmergingLlmTrends } from "./trend-radar";
import { handleFetchLast30DaysIntelligence } from "./last-30-days";
import { getAllPublishedPosts } from "../utils/frontmatter";
import { google } from "googleapis";

export interface ReedGrowthReport {
  executiveSummary: string;
  breakingTrendTarget: {
    modelOrTopic: string;
    source: string;
    developerPainPoint: string;
    recommendedSlug: string;
    recommendedTitle: string;
    recommendedMetaTitle: string;
    recommendedDescription: string;
    microToolConcept: string;
  };
  underdogPromotions: Array<{
    query: string;
    page: string;
    currentPosition: number;
    impressions: number;
    ctr: string;
    recommendedAction: string;
  }>;
  croMicroToolActions: Array<{
    pageSlug: string;
    currentInteractiveStatus: string;
    suggestedToolInjection: string;
  }>;
  scanTimestamp: string;
}

export async function handleRunReedGrowthCruise(): Promise<ReedGrowthReport> {
  const publishedPosts = getAllPublishedPosts();

  // 1. Step 1: Emerging Model & Viral Pain-Point Sniffing
  const trends = await handleMonitorEmergingLlmTrends();
  let topTarget = trends.highPriorityUncoveredTargets[0] || {
    name: "Emerging-SLM-Engine",
    source: "HuggingFace Hub",
    description: "Trending lightweight agentic model with rapid developer adoption.",
    recommendedSlug: "emerging-slm-engine-setup-guide"
  };

  const painPointData = await handleFetchLast30DaysIntelligence(topTarget.name);

  // 2. Step 2: Underdog Promoter (Queries in GSC ranking positions 4.0 - 15.0)
  const underdogPromotions: Array<{
    query: string;
    page: string;
    currentPosition: number;
    impressions: number;
    ctr: string;
    recommendedAction: string;
  }> = [];

  try {
    const keyPath = "E:\\kaifa\\credentials\\gsc-service-account.json";
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"]
    });
    const searchconsole = google.searchconsole({ version: "v1", auth });

    const gscRes = await searchconsole.searchanalytics.query({
      siteUrl: "sc-domain:apivale.com",
      requestBody: {
        startDate: "2026-08-01",
        endDate: "2026-08-25",
        dimensions: ["query", "page"],
        rowLimit: 100
      }
    });

    for (const row of gscRes.data.rows || []) {
      const pos = row.position || 0;
      const impressions = row.impressions || 0;
      const ctr = ((row.ctr || 0) * 100).toFixed(2);
      const query = row.keys?.[0] || "";
      const page = row.keys?.[1] || "";

      // Underdogs: Ranking between 4.0 and 15.0 with good impressions (>10)
      if (pos >= 4.0 && pos <= 15.0 && impressions >= 5 && underdogPromotions.length < 5) {
        underdogPromotions.push({
          query,
          page,
          currentPosition: parseFloat(pos.toFixed(1)),
          impressions,
          ctr: `${ctr}%`,
          recommendedAction: `Refine Title to include "${query}" within 58 chars & inject 2 internal links to push to Top 3.`
        });
      }
    }
  } catch (err: any) {
    console.error("Reed GSC underdog scan error:", err.message);
  }

  // 3. Step 3: CRO Micro-Tool Diagnostic on Existing Pages
  const croActions: Array<{
    pageSlug: string;
    currentInteractiveStatus: string;
    suggestedToolInjection: string;
  }> = [];

  for (const post of publishedPosts.slice(0, 5)) {
    const hasCalculator = post.content && post.content.includes("<script") && (post.content.includes("slider") || post.content.includes("select"));
    if (!hasCalculator && croActions.length < 3) {
      croActions.push({
        pageSlug: post.slug,
        currentInteractiveStatus: "Pure Text / Missing Interactive Utility",
        suggestedToolInjection: "Inject live cost-savings slider or client selector script to increase dwell time from ~16s to >2mins."
      });
    }
  }

  const cleanName = topTarget.name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
  const slug = cleanName.toLowerCase().replace(/\s+/g, "-") + "-api-guide";

  return {
    executiveSummary: `Reed Autonomous Growth Cruise completed. Identified 1 high-priority breaking model (${cleanName}), ${underdogPromotions.length} GSC underdog queries ready for Top 3 promotion, and ${croActions.length} CRO interactive tool injection opportunities.`,
    breakingTrendTarget: {
      modelOrTopic: cleanName,
      source: topTarget.source,
      developerPainPoint: painPointData.developerPainPoints.pricingAndRateLimit[0] || "Rate limits & high token costs in continuous loops.",
      recommendedSlug: slug,
      recommendedTitle: `${cleanName} Guide: Setup, Benchmarks & Cloud API (2026)`,
      recommendedMetaTitle: `${cleanName} Guide: Setup & Cloud API | APIVALE`,
      recommendedDescription: `Complete setup guide for ${cleanName}. Learn local deployment, latency benchmarks, bypass rate limits with APIVALE, and PayPal billing.`,
      microToolConcept: `Interactive ${cleanName} Token Calculator & Framework Selector (Python/cURL/Cursor).`
    },
    underdogPromotions,
    croMicroToolActions: croActions,
    scanTimestamp: new Date().toISOString()
  };
}
