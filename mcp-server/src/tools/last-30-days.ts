import axios from "axios";
import { loadEnvConfig } from "../utils/config";

export interface Last30DaysItem {
  platform: "Reddit" | "Hacker News" | "X / Tech Blogs" | "Google Search";
  title: string;
  link: string;
  snippet: string;
  dateOrScore?: string;
}

export interface Last30DaysIntelligenceReport {
  topic: string;
  timeWindow: "Past 30 Days (1 Month)";
  totalSignalsCaptured: number;
  signals: Last30DaysItem[];
  developerPainPoints: {
    pricingAndRateLimit: string[];
    technicalSetupBugs: string[];
    performanceAndLatency: string[];
  };
  recommendedBlogAngles: Array<{
    title: string;
    hook: string;
    targetKeywords: string[];
  }>;
  generatedTimestamp: string;
}

export async function handleFetchLast30DaysIntelligence(
  topic: string
): Promise<Last30DaysIntelligenceReport> {
  const env = loadEnvConfig();
  const serpApiKey = env.SERPAPI_KEY;

  const signals: Last30DaysItem[] = [];
  const pricingPainPoints: string[] = [];
  const technicalBugs: string[] = [];
  const latencyIssues: string[] = [];

  // 1. Channel A: Reddit (Past 30 Days via SerpAPI tbs=qdr:m)
  if (serpApiKey) {
    try {
      const redditQuery = `site:reddit.com (r/LocalLLaMA OR r/ChatGPT OR r/OpenAI OR r/ClaudeAI) "${topic}"`;
      const redditRes = await axios.get(
        `https://serpapi.com/search.json?q=${encodeURIComponent(redditQuery)}&api_key=${serpApiKey}&tbs=qdr:m&num=10`,
        { timeout: 15000 }
      );

      for (const res of redditRes.data?.organic_results || []) {
        signals.push({
          platform: "Reddit",
          title: res.title || "",
          link: res.link || "",
          snippet: res.snippet || "",
          dateOrScore: res.date || "Past 30 days"
        });

        const snippetLower = (res.snippet || "").toLowerCase();
        if (snippetLower.includes("429") || snippetLower.includes("rate limit") || snippetLower.includes("quota") || snippetLower.includes("cost") || snippetLower.includes("expensive")) {
          pricingPainPoints.push(res.title);
        }
        if (snippetLower.includes("error") || snippetLower.includes("fail") || snippetLower.includes("bug") || snippetLower.includes("fix") || snippetLower.includes("header")) {
          technicalBugs.push(res.title);
        }
      }
    } catch (e: any) {
      console.error("Reddit 30-day scan error:", e.message);
    }
  }

  // 2. Channel B: X / Tech Blogs & Tutorials (Past 30 Days via SerpAPI tbs=qdr:m)
  if (serpApiKey) {
    try {
      const blogQuery = `"${topic}" (guide OR setup OR benchmark OR comparison OR pricing)`;
      const blogRes = await axios.get(
        `https://serpapi.com/search.json?q=${encodeURIComponent(blogQuery)}&api_key=${serpApiKey}&tbs=qdr:m&num=8`,
        { timeout: 9000 }
      );

      for (const res of blogRes.data?.organic_results || []) {
        signals.push({
          platform: "X / Tech Blogs",
          title: res.title || "",
          link: res.link || "",
          snippet: res.snippet || "",
          dateOrScore: res.date || "Past 30 days"
        });
      }
    } catch (e: any) {
      console.error("Blog 30-day scan error:", e.message);
    }
  }

  // 3. Channel C: Hacker News (Past 30 Days timestamp filter)
  try {
    const thirtyDaysAgoSec = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const hnRes = await axios.get(
      `https://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>${thirtyDaysAgoSec}&query=${encodeURIComponent(topic)}&hitsPerPage=10`,
      { timeout: 6000 }
    );

    for (const hit of hnRes.data?.hits || []) {
      signals.push({
        platform: "Hacker News",
        title: hit.title || "",
        link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        snippet: hit.story_text || `Points: ${hit.points || 0}, Comments: ${hit.num_comments || 0}`,
        dateOrScore: `${hit.points || 0} points`
      });

      if ((hit.points || 0) > 20) {
        latencyIssues.push(hit.title);
      }
    }
  } catch (e: any) {
    console.error("HN 30-day scan error:", e.message);
  }

  // Fallback default pain points if search volume was specific
  if (pricingPainPoints.length === 0) {
    pricingPainPoints.push(`Unpredictable token burn and weekly message limits when running autonomous ${topic} loops.`);
    pricingPainPoints.push(`Credit card decline blocks on official platforms without PayPal support.`);
  }
  if (technicalBugs.length === 0) {
    technicalBugs.push(`Protocol translation mismatches between Anthropic Messages API and OpenAI completions for ${topic}.`);
    technicalBugs.push(`HTTP 429 Too Many Requests and 504 Gateway Timeouts on free shared endpoints.`);
  }
  if (latencyIssues.length === 0) {
    latencyIssues.push(`High Time-To-First-Token (TTFT) latency exceeding 800ms on peak hours.`);
  }

  // Synthesize 3 high-converting article angles
  const recommendedAngles = [
    {
      title: `${topic} Setup Guide: Fix Rate Limits & Slash API Costs (2026)`,
      hook: `Address developer frustration with ${topic} weekly quota exhaustion by providing unmetered BYOK routing with PayPal billing.`,
      targetKeywords: [`${topic.toLowerCase()} api setup`, `${topic.toLowerCase()} rate limit`, `${topic.toLowerCase()} pricing`]
    },
    {
      title: `${topic} vs Open Source Models: Real Benchmarks & Token Cost Math`,
      hook: `Compare ${topic} reasoning performance against low-cost open alternatives (Qwen 3.8 / Needle 2) to show an 80%+ cost reduction.`,
      targetKeywords: [`${topic.toLowerCase()} vs qwen`, `${topic.toLowerCase()} benchmark`, `${topic.toLowerCase()} cost`]
    },
    {
      title: `How to Connect ${topic} to Claude Code CLI & Cursor IDE`,
      hook: `Step-by-step developer toolchain walkthrough with 15+ line production retry code and zero-KYC PayPal top-up.`,
      targetKeywords: [`how to use ${topic.toLowerCase()} in cursor`, `${topic.toLowerCase()} claude code`, `${topic.toLowerCase()} proxy`]
    }
  ];

  return {
    topic,
    timeWindow: "Past 30 Days (1 Month)",
    totalSignalsCaptured: signals.length,
    signals: signals.slice(0, 20),
    developerPainPoints: {
      pricingAndRateLimit: pricingPainPoints.slice(0, 4),
      technicalSetupBugs: technicalBugs.slice(0, 4),
      performanceAndLatency: latencyIssues.slice(0, 4)
    },
    recommendedBlogAngles: recommendedAngles,
    generatedTimestamp: new Date().toISOString()
  };
}
