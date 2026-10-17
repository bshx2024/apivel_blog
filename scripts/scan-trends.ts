#!/usr/bin/env bun
/**
 * 🛰️ APIVALE Multi-Entity Trend Radar Scanner
 * (Inspired by TrendSpy NewTrend 3.0 & Entity Seeds)
 *
 * Scans all core LLM and Coding Agent entities against Google Chrome Suggest,
 * cross-references published posts on APIVALE, and identifies Uncovered Content Gaps!
 *
 * Usage:
 *   bun run scripts/scan-trends.ts
 */

import fs from "node:fs";
import path from "node:path";
import { sendFeishuBlogAlert, BlogAlertItem } from "./notifier.js";

interface EntitySeed {
  name: string;
  category: "Chinese Frontier LLM" | "Western Flagship" | "Coding Agent & IDE";
  modifiers: string[];
}

const ENTITY_SEEDS: EntitySeed[] = [
  // 1. Chinese Frontier LLMs (APIVALE Main Inventory)
  {
    name: "deepseek",
    category: "Chinese Frontier LLM",
    modifiers: ["api", "v4", "pricing", "claude code", "token cost"]
  },
  {
    name: "qwen",
    category: "Chinese Frontier LLM",
    modifiers: ["3.8", "3.7 max", "api", "cursor", "claude code"]
  },
  {
    name: "glm",
    category: "Chinese Frontier LLM",
    modifiers: ["5.3", "flash", "api", "zhipu", "cursor"]
  },
  {
    name: "kimi",
    category: "Chinese Frontier LLM",
    modifiers: ["k3", "api", "pricing", "claude code"]
  },
  {
    name: "minimax",
    category: "Chinese Frontier LLM",
    modifiers: ["h3", "m3.1", "api pricing", "video api"]
  },

  // 2. Western Flagships (Arbitrage & Comparison Targets)
  {
    name: "openai",
    category: "Western Flagship",
    modifiers: ["dots", "gpt-6", "astra", "sol", "api pricing"]
  },
  {
    name: "claude",
    category: "Western Flagship",
    modifiers: ["sonnet 5", "opus 5.5", "code cli", "api cost"]
  },
  {
    name: "meta",
    category: "Western Flagship",
    modifiers: ["muse", "model api", "spark", "pricing"]
  },

  // 3. Coding Agents & Gateways
  {
    name: "cursor",
    category: "Coding Agent & IDE",
    modifiers: ["byok", "api key", "custom model", "rules"]
  },
  {
    name: "claude code",
    category: "Coding Agent & IDE",
    modifiers: ["custom base url", "deepseek", "qwen", "mcp"]
  },
  {
    name: "opencode",
    category: "Coding Agent & IDE",
    modifiers: ["paypal", "token cost", "deepseek"]
  }
];

// Helper: Read all published blog post slugs and titles
function getPublishedSlugs(): Set<string> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const slugs = new Set<string>();
  if (!fs.existsSync(blogDir)) return slugs;

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".md"));
  for (const f of files) {
    slugs.add(f.replace(".md", "").toLowerCase());
  }
  return slugs;
}

// Google Suggest client
async function probeGoogle(query: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=us&q=${encodeURIComponent(query + " ")}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

// Check coverage against published slugs
function isTopicCovered(candidate: string, publishedSlugs: Set<string>): boolean {
  const normCandidate = candidate.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const slug of publishedSlugs) {
    const normSlug = slug.replace(/[^a-z0-9]/g, "");
    if (normSlug.includes(normCandidate) || normCandidate.includes(normSlug)) {
      return true;
    }
  }
  return false;
}

async function scan() {
  console.log(`\n===============================================================`);
  console.log(`🛰️ APIVALE Multi-Entity Trend Radar Scanning (${ENTITY_SEEDS.length} Entities)...`);
  console.log(`===============================================================\n`);

  const publishedSlugs = getPublishedSlugs();
  console.log(`📚 Indexed ${publishedSlugs.size} published blog articles.\n`);

  const uncoveredOpportunities: Array<{
    query: string;
    seed: string;
    category: string;
    suggestedSlug: string;
  }> = [];

  for (const entity of ENTITY_SEEDS) {
    for (const mod of entity.modifiers) {
      const probeQuery = `${entity.name} ${mod}`;
      const results = await probeGoogle(probeQuery);

      for (const res of results.slice(0, 3)) {
        if (!isTopicCovered(res, publishedSlugs)) {
          const suggestedSlug = res
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          // Avoid duplicates
          if (!uncoveredOpportunities.some(o => o.query === res)) {
            uncoveredOpportunities.push({
              query: res,
              seed: entity.name,
              category: entity.category,
              suggestedSlug
            });
          }
        }
      }
      // Be polite to Google rate limits
      await new Promise(r => setTimeout(r, 120));
    }
  }

  console.log(`🚨 Found ${uncoveredOpportunities.length} Uncovered Commercial Topics:\n`);
  console.log(`| Category | Target Keyword | Suggested Slug | Action |`);
  console.log(`| :--- | :--- | :--- | :--- |`);

  uncoveredOpportunities.slice(0, 15).forEach(o => {
    console.log(`| ${o.category} | **${o.query}** | \`${o.suggestedSlug}\` | \`bun run scripts/fast-trend-probe.ts "${o.query}"\` |`);
  });

  console.log(`\n💡 To generate a full blog frontmatter scaffold for any keyword above:`);
  console.log(`   bun run scripts/fast-trend-probe.ts "<keyword>"\n`);

  // If --alert flag is passed, dispatch top 3 opportunities to Feishu
  const shouldAlert = process.argv.includes("--alert");
  if (shouldAlert && uncoveredOpportunities.length > 0) {
    console.log(`📡 Dispatching Top 3 opportunities to Feishu Webhook...`);
    const alertItems: BlogAlertItem[] = uncoveredOpportunities.slice(0, 3).map(o => ({
      keyword: o.query,
      category: o.category,
      level: "S (极速抢发)",
      suggestedSlug: o.suggestedSlug,
      metaTitle: `${o.query} API: Pricing, Setup & Cost Guide | APIVALE`,
      suggestedH1: `${o.query} API & Pricing: Production Setup & Arbitrage Guide`,
      trendsUrl: `https://trends.google.com/trends/explore?q=${encodeURIComponent(o.query)}`,
      serpUrl: `https://www.google.com/search?q=${encodeURIComponent(o.query)}`
    }));

    const alertResult = await sendFeishuBlogAlert(alertItems);
    console.log(`[+] Feishu Alert Result: ${alertResult.message}`);
  }
}

scan();
