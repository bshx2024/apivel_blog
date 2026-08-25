import fs from "fs";
import { KEYWORD_PLAN_PATH, WRITING_STANDARD_PATH } from "../utils/config";
import { getAllPublishedPosts } from "../utils/frontmatter";

export interface EditorialTask {
  index: string;
  proposedTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  targetIntent: string;
  status: string;
}

export function handleGetEditorialPlan(): {
  summary: { total: number; planned: number; published: number };
  nextPlannedTasks: EditorialTask[];
  allTasks: EditorialTask[];
} {
  if (!fs.existsSync(KEYWORD_PLAN_PATH)) {
    throw new Error(`KEYWORD_PLAN.md not found at ${KEYWORD_PLAN_PATH}`);
  }

  const content = fs.readFileSync(KEYWORD_PLAN_PATH, "utf-8");
  const lines = content.split("\n");
  const tasks: EditorialTask[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && !trimmed.includes("Proposed Article Title") && !trimmed.includes(":---")) {
      const cols = trimmed.split("|").map(c => c.trim()).filter(Boolean);
      if (cols.length >= 6) {
        const index = cols[0].replace(/\*\*/g, "");
        const proposedTitle = cols[1].replace(/\*/g, "");
        const primaryKeyword = cols[2].replace(/`/g, "");
        const secondaryKeywords = cols[3].replace(/`/g, "");
        const targetIntent = cols[4];
        const status = cols[5];

        tasks.push({
          index,
          proposedTitle,
          primaryKeyword,
          secondaryKeywords,
          targetIntent,
          status
        });
      }
    }
  }

  const plannedTasks = tasks.filter(t => t.status.includes("Planned"));
  const publishedTasks = tasks.filter(t => t.status.includes("Published"));

  return {
    summary: {
      total: tasks.length,
      planned: plannedTasks.length,
      published: publishedTasks.length
    },
    nextPlannedTasks: plannedTasks,
    allTasks: tasks
  };
}

export function handleGetWritingStandard(): {
  content: string;
  summaryChecklist: string[];
} {
  if (!fs.existsSync(WRITING_STANDARD_PATH)) {
    throw new Error(`BLOG_WRITING_STANDARD.md not found at ${WRITING_STANDARD_PATH}`);
  }

  const content = fs.readFileSync(WRITING_STANDARD_PATH, "utf-8");
  
  const summaryChecklist = [
    "1. Information Gain: Must include 4 real engineering proofs (protocol mapping, real error logs, benchmark math, 15+ lines production code with backoff).",
    "2. Anti-Spam: Prohibit boilerplate opening templates (e.g. 'Running autonomous AI coding agents... burns $40...').",
    "3. Anti-Hallucination: Strictly ban synthetic AI formulas (e.g. 'The 3-Tier Matrix/Triangle'). Use genuine engineering terms.",
    "4. Title Formula: ABC Title ([Adjective/Primary] + [Secondary LSI] | [APIVALE Hook]) within 50-60 characters.",
    "5. Conversion Rate Optimization (CRO): Must include Above-the-Fold Key Takeaways box with $0.20 free credit link, Copy-Paste interactive CLI/IDE config, and PayPal callout.",
    "6. Commercial Fulfillment: Only PayPal billing supported (Zero KYC / Instant PayPal checkout). No Stripe / Crypto.",
    "7. Model Recency: Reference Claude Sonnet 5, Qwen 3.8 / 3.7 Max (infer/qwen3.7-max), DeepSeek V4.",
    "8. FAQ Schema: Integrate JSON-LD FAQPage and Featured Snippet definition blocks."
  ];

  const conversionTemplates = {
    keyTakeawaysBox: `<div class="my-6 border-l-4 border-emerald-500 bg-gray-900 rounded-r-lg p-5">\n  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Takeaways</span>\n  <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-gray-300">\n    <li><strong>Cost Reduction:</strong> Routing requests via <a href="https://apivale.com/sign-up?redirect={{SLUG_URL}}" class="text-emerald-400 hover:underline font-semibold">APIVALE (Claim $0.20 Free Test Credit)</a> cuts token spend by up to 85%.</li>\n    <li><strong>Sub-450ms TTFT:</strong> Optimized routing delivers sub-450ms latency with zero local GPU hardware bottlenecks.</li>\n    <li><strong>Global PayPal Billing:</strong> Instant checkout with zero credit card rejections and zero KYC requirements.</li>\n  </ul>\n</div>`,
    interactiveBanner: `<div id="single-url-interactive-banner" class="my-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-gray-900 rounded-xl p-6 shadow-xl">\n  <div class="flex items-center justify-between flex-wrap gap-3 mb-3">\n    <span class="inline-flex items-center text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">⚡ Quick Interactive Setup</span>\n    <span class="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">Free Starter Credit: $0.20</span>\n  </div>\n  <p class="text-sm text-gray-300 mb-4 leading-relaxed">Sign up to claim <strong>$0.20 free starter credit</strong> (100K+ tokens). Use the copy command below for instant connection.</p>\n</div>`
  };

  return {
    content,
    summaryChecklist,
    conversionTemplates
  };
}

export function handleGetTopicalAuthorityMap(): {
  totalArticles: number;
  averageWordCount: number;
  tagDistribution: Record<string, number>;
  categoryClusters: Record<string, { count: number; slugs: string[] }>;
  coverageGaps: string[];
} {
  const posts = getAllPublishedPosts();
  const tagDistribution: Record<string, number> = {};
  let totalWords = 0;

  const categoryClusters: Record<string, { count: number; slugs: string[] }> = {
    "IDE & CLI Setup Guides": { count: 0, slugs: [] },
    "Model Cost & Pricing Comparison": { count: 0, slugs: [] },
    "Error Troubleshooting & Rate Limits": { count: 0, slugs: [] },
    "New Model Benchmarks & Deep Dives": { count: 0, slugs: [] },
    "OpenRouter & Gateway Alternatives": { count: 0, slugs: [] }
  };

  for (const post of posts) {
    totalWords += post.wordCount;
    for (const tag of post.frontmatter.tags || []) {
      tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
    }

    const titleLower = (post.frontmatter.title || "").toLowerCase();
    const slugLower = post.slug.toLowerCase();

    if (slugLower.includes("setup") || slugLower.includes("connect") || titleLower.includes("connect") || titleLower.includes("setup")) {
      categoryClusters["IDE & CLI Setup Guides"].count++;
      categoryClusters["IDE & CLI Setup Guides"].slugs.push(post.slug);
    } else if (slugLower.includes("price") || slugLower.includes("cost") || titleLower.includes("cost") || titleLower.includes("price")) {
      categoryClusters["Model Cost & Pricing Comparison"].count++;
      categoryClusters["Model Cost & Pricing Comparison"].slugs.push(post.slug);
    } else if (slugLower.includes("fix") || slugLower.includes("error") || slugLower.includes("troubleshoot") || titleLower.includes("rate limit")) {
      categoryClusters["Error Troubleshooting & Rate Limits"].count++;
      categoryClusters["Error Troubleshooting & Rate Limits"].slugs.push(post.slug);
    } else if (slugLower.includes("benchmark") || slugLower.includes("vs") || titleLower.includes("comparison")) {
      categoryClusters["New Model Benchmarks & Deep Dives"].count++;
      categoryClusters["New Model Benchmarks & Deep Dives"].slugs.push(post.slug);
    } else {
      categoryClusters["OpenRouter & Gateway Alternatives"].count++;
      categoryClusters["OpenRouter & Gateway Alternatives"].slugs.push(post.slug);
    }
  }

  // Detect coverage gaps based on low cluster counts or planned needs
  const coverageGaps: string[] = [];
  if (categoryClusters["Model Cost & Pricing Comparison"].count < 8) {
    coverageGaps.push("Deep-dive enterprise token cost comparison vs official OpenAI/Anthropic rates.");
  }
  if (categoryClusters["Error Troubleshooting & Rate Limits"].count < 6) {
    coverageGaps.push("Terminal CLI streaming error handling (401/429/502) & proxy failover tutorials.");
  }

  return {
    totalArticles: posts.length,
    averageWordCount: posts.length > 0 ? Math.round(totalWords / posts.length) : 0,
    tagDistribution,
    categoryClusters,
    coverageGaps
  };
}
