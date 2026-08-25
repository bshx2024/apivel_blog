import { handleMonitorEmergingLlmTrends } from "./trend-radar";
import { handleFetchLast30DaysIntelligence } from "./last-30-days";
import { getAllPublishedPosts } from "../utils/frontmatter";
import { loadEnvConfig } from "../utils/config";
import { google } from "googleapis";
import axios from "axios";

export interface GoogleTrendsCurveDiagnosis {
  query: string;
  isAvailable: boolean;
  peakValue: number;
  latestValue: number;
  sustainabilityRatio: number;
  curveClassification: "SustainableGrowth" | "SpikeAndDie" | "InsufficientData";
  recommendation: string;
}

export async function checkGoogleTrendsCurve(query: string): Promise<GoogleTrendsCurveDiagnosis> {
  const env = loadEnvConfig();
  const serpApiKey = env.SERPAPI_KEY;

  if (!serpApiKey) {
    return {
      query,
      isAvailable: false,
      peakValue: 0,
      latestValue: 0,
      sustainabilityRatio: 0,
      curveClassification: "InsufficientData",
      recommendation: "SerpAPI key not configured for Google Trends."
    };
  }

  try {
    const res = await axios.get(
      `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&date=now+7-d&api_key=${serpApiKey}`,
      { timeout: 12000 }
    );

    const timeline = res.data?.interest_over_time?.timeline_data;
    if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
      return {
        query,
        isAvailable: true,
        peakValue: 0,
        latestValue: 0,
        sustainabilityRatio: 0,
        curveClassification: "InsufficientData",
        recommendation: "Very low search baseline. Recommended for cluster absorption rather than standalone pillar."
      };
    }

    const values = timeline.map(t => t.values?.[0]?.extracted_value || 0);
    const peak = Math.max(...values, 0);
    
    // Average of latest 24 hours (last 24 data points or last 20% of timeline)
    const recentPoints = values.slice(-12);
    const recentAvg = recentPoints.reduce((a, b) => a + b, 0) / (recentPoints.length || 1);

    const ratio = peak > 0 ? recentAvg / peak : 0;

    if (peak > 30 && ratio < 0.15) {
      return {
        query,
        isAvailable: true,
        peakValue: peak,
        latestValue: Math.round(recentAvg),
        sustainabilityRatio: parseFloat(ratio.toFixed(2)),
        curveClassification: "SpikeAndDie",
        recommendation: "⚠️ FLASH IN THE PAN (Spike & Die): Search volume collapsed after single-day spike. DO NOT write standalone article. Absorb into existing model matrix tables only."
      };
    }

    return {
      query,
      isAvailable: true,
      peakValue: peak,
      latestValue: Math.round(recentAvg),
      sustainabilityRatio: parseFloat(ratio.toFixed(2)),
      curveClassification: "SustainableGrowth",
      recommendation: "✅ SUSTAINABLE TARGET: Active search interest sustained across past 7 days. High ROI for standalone pillar guide."
    };
  } catch (err: any) {
    return {
      query,
      isAvailable: false,
      peakValue: 0,
      latestValue: 0,
      sustainabilityRatio: 0,
      curveClassification: "InsufficientData",
      recommendation: `Google Trends scan error: ${err.message}`
    };
  }
}

export interface ReedGrowthReport {
  executiveSummary: string;
  breakingTrendTarget: {
    modelOrTopic: string;
    source: string;
    googleTrendsDiagnosis: GoogleTrendsCurveDiagnosis;
    developerPainPoint: string;
    recommendedSlug: string;
    recommendedTitle: string;
    recommendedMetaTitle: string;
    recommendedDescription: string;
    microToolConcept: string;
    actionVerdict: "APPROVED_FOR_STANDALONE" | "ABSORB_INTO_EXISTING_MATRIX_ONLY";
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
  let candidateTarget = trends.highPriorityUncoveredTargets[0] || {
    name: "Qwen 3.8 Max",
    source: "HuggingFace Hub",
    description: "Trending lightweight agentic model with rapid developer adoption.",
    recommendedSlug: "qwen-3-8-max-guide"
  };

  const cleanName = candidateTarget.name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
  
  // 2. Step 2: Google Trends Anti-Spike Filter (New Safety Firewall)
  const trendsDiagnosis = await checkGoogleTrendsCurve(cleanName);
  const painPointData = await handleFetchLast30DaysIntelligence(cleanName);

  const isApproved = trendsDiagnosis.curveClassification === "SustainableGrowth";
  const actionVerdict = isApproved ? "APPROVED_FOR_STANDALONE" : "ABSORB_INTO_EXISTING_MATRIX_ONLY";

  // 3. Step 3: Underdog Promoter (Queries in GSC ranking positions 4.0 - 15.0)
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

  // 4. Step 4: CRO Micro-Tool Diagnostic on Existing Pages
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

  const slug = cleanName.toLowerCase().replace(/\s+/g, "-") + "-api-guide";

  return {
    executiveSummary: `Reed Autonomous Growth Cruise completed. Google Trends Filter evaluated "${cleanName}" as ${trendsDiagnosis.curveClassification} (${actionVerdict}). Identified ${underdogPromotions.length} GSC underdog queries ready for Top 3 promotion and ${croActions.length} CRO interactive tool injection opportunities.`,
    breakingTrendTarget: {
      modelOrTopic: cleanName,
      source: candidateTarget.source,
      googleTrendsDiagnosis: trendsDiagnosis,
      developerPainPoint: painPointData.developerPainPoints.pricingAndRateLimit[0] || "Rate limits & high token costs in continuous loops.",
      recommendedSlug: slug,
      recommendedTitle: `${cleanName} Guide: Setup, Benchmarks & Cloud API (2026)`,
      recommendedMetaTitle: `${cleanName} Guide: Setup & Cloud API | APIVALE`,
      recommendedDescription: `Complete setup guide for ${cleanName}. Learn local deployment, latency benchmarks, bypass rate limits with APIVALE, and PayPal billing.`,
      microToolConcept: `Interactive ${cleanName} Token Calculator & Framework Selector (Python/cURL/Cursor).`,
      actionVerdict
    },
    underdogPromotions,
    croMicroToolActions: croActions,
    scanTimestamp: new Date().toISOString()
  };
}
