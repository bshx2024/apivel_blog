import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Tools
import {
  handleGetEditorialPlan,
  handleGetWritingStandard,
  handleGetTopicalAuthorityMap
} from "./tools/editorial";

import {
  handleAnalyzeGoogleSearchIntent,
  handleAnalyzeSerpCompetitors
} from "./tools/serp-intent";

import {
  handleMonitorEmergingLlmTrends,
  handleExtractCommunityPainpoints
} from "./tools/trend-radar";

import { handleFetchLast30DaysIntelligence } from "./tools/last-30-days";
import { handleRunReedGrowthCruise } from "./tools/reed-growth-engine";

import {
  handleDraftForReview,
  handleApproveAndPublish,
  handleCheckKeywordCannibalization,
  handleAuditArticleSeoHealth,
  handleRefreshArticleMetadata
} from "./tools/content-manager";

import { handleWeaveInternalLinks } from "./tools/internal-linker";

import {
  handleLogSeoAction,
  handleSyncAndDeploy,
  handleFetchGscPerformance,
  handlePostPublishMonitor,
  handleCheckPagePerformance
} from "./tools/deployer";

// Initialize MCP Server
const server = new McpServer({
  name: "apivale-blog-seo",
  version: "1.0.0"
});

// -----------------------------------------------------------------------------
// 1. Editorial Planning & Standard Tools
// -----------------------------------------------------------------------------

server.tool(
  "get_editorial_plan",
  "Reads KEYWORD_PLAN.md to return the next planned editorial topics and keyword clusters",
  {},
  async () => {
    const result = handleGetEditorialPlan();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "get_writing_standard",
  "Loads the latest APIVALE Master Blog Writing & Anti-Spam SEO/GEO Standard (BLOG_WRITING_STANDARD.md)",
  {},
  async () => {
    const result = handleGetWritingStandard();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "get_topical_authority_map",
  "Scans all 47+ published articles in src/content/blog/ to generate an authority heatmap across categories and tags",
  {},
  async () => {
    const result = handleGetTopicalAuthorityMap();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// 2. Google Intent & SERP Tools
// -----------------------------------------------------------------------------

server.tool(
  "analyze_google_search_intent",
  "Calls Google Autocomplete in real-time to extract user dropdown search predictions and derives a 3-tier keyword architecture",
  {
    query: z.string().describe("Target keyword query (e.g. 'qwen 3.8 api')"),
    market: z.string().optional().default("us").describe("Target country code ('us', 'uk', 'global')")
  },
  async ({ query, market }) => {
    const result = await handleAnalyzeGoogleSearchIntent(query, market);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "analyze_serp_competitors",
  "Fetches and analyzes Top 5 SERP competitors for a keyword to generate a Content Gap report (Requires SerpAPI key in Phase 2)",
  {
    keyword: z.string().describe("Target primary search query")
  },
  async ({ keyword }) => {
    const result = await handleAnalyzeSerpCompetitors(keyword);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// 3. Trend Radar & Community Painpoint Tools
// -----------------------------------------------------------------------------

server.tool(
  "monitor_emerging_llm_trends",
  "Scans HuggingFace Model Hub trending models and cross-references against the site's existing coverage to detect uncovered new models",
  {},
  async () => {
    const result = await handleMonitorEmergingLlmTrends();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "extract_community_painpoints",
  "Extracts developer friction points (error codes, CLI config, payment hurdles) for a specific AI model from community discussions",
  {
    model_name: z.string().describe("Model name (e.g. 'Ox Alpha', 'GLM-5.3', 'Qwen 3.8')")
  },
  async ({ model_name }) => {
    const result = await handleExtractCommunityPainpoints(model_name);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// 4. Content Management & Anti-Spam Safeguards
// -----------------------------------------------------------------------------

server.tool(
  "draft_for_review",
  "Saves an article to src/content/drafts/<slug>.md and runs pre-publish Anti-Spam audit for human review",
  {
    slug: z.string().describe("Article URL slug (lowercase, hyphen-separated, e.g. 'how-to-reduce-llm-api-costs')"),
    frontmatter: z.object({
      title: z.string(),
      metaTitle: z.string(),
      description: z.string(),
      date: z.string(),
      author: z.string().default("Alex Rivera"),
      authorTitle: z.string().optional(),
      authorBio: z.string().optional(),
      tags: z.array(z.string()),
      image: z.string().default("/blog/og-cover.png"),
      lang: z.string().default("en")
    }),
    markdown_body: z.string().describe("Full markdown body of the blog post")
  },
  async ({ slug, frontmatter, markdown_body }) => {
    const result = handleDraftForReview(slug, frontmatter, markdown_body);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "approve_and_publish",
  "Validates and publishes an approved draft (or direct post) into src/content/blog/<slug>.md with strict Anti-Spam enforcement",
  {
    slug: z.string().describe("Article slug to publish"),
    frontmatter: z.object({
      title: z.string(),
      metaTitle: z.string(),
      description: z.string(),
      date: z.string(),
      author: z.string().default("Alex Rivera"),
      authorTitle: z.string().optional(),
      authorBio: z.string().optional(),
      tags: z.array(z.string()),
      image: z.string().default("/blog/og-cover.png"),
      lang: z.string().default("en")
    }).optional(),
    markdown_body: z.string().optional()
  },
  async ({ slug, frontmatter, markdown_body }) => {
    const result = handleApproveAndPublish(slug, frontmatter, markdown_body);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "check_keyword_cannibalization",
  "Scans all published articles to detect potential keyword cannibalization or topic duplication before publishing",
  {
    target_keywords: z.array(z.string()).describe("List of target primary and secondary keywords"),
    proposed_title: z.string().describe("Proposed title of the new article")
  },
  async ({ target_keywords, proposed_title }) => {
    const result = handleCheckKeywordCannibalization(target_keywords, proposed_title);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "audit_article_seo_health",
  "Inspects an existing blog post for SEO health, title length, H2 hierarchy, internal links, and anti-spam compliance",
  {
    slug: z.string().describe("Article slug (e.g. 'how-to-connect-qwen-3-8-to-claude-code-cli')")
  },
  async ({ slug }) => {
    const result = handleAuditArticleSeoHealth(slug);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "refresh_article_metadata",
  "Updates dateModified and metadata for an existing article without altering the original publish date",
  {
    slug: z.string().describe("Target article slug"),
    updates: z.object({
      metaTitle: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      dateModified: z.string().optional()
    }),
    text_replacements: z.array(z.object({
      search: z.string(),
      replace: z.string()
    })).optional()
  },
  async ({ slug, updates, text_replacements }) => {
    const result = handleRefreshArticleMetadata(slug, updates, text_replacements);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// 5. Internal Link Weaving Tool
// -----------------------------------------------------------------------------

server.tool(
  "weave_internal_links",
  "Scans the entire blog library and automatically weaves bidirectional contextual internal links into up to 3 relevant articles",
  {
    target_slug: z.string().describe("The slug of the newly published article receiving links"),
    target_title: z.string().describe("The title of the newly published article"),
    anchor_keywords: z.array(z.string()).describe("Candidate anchor text keywords (e.g. ['Qwen 3.8', 'Claude Code CLI proxy'])"),
    max_injections: z.number().optional().default(3).describe("Maximum number of articles to inject links into")
  },
  async ({ target_slug, target_title, anchor_keywords, max_injections }) => {
    const result = handleWeaveInternalLinks(target_slug, target_title, anchor_keywords, max_injections);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// 6. Deployer & Action Log Tools
// -----------------------------------------------------------------------------

server.tool(
  "log_seo_action",
  "Appends an optimization entry to SEO_ACTION_LOG.md for 2-week causal attribution tracking",
  {
    category: z.enum([
      "📝 [内容动作]",
      "🔗 [外链与推广]",
      "⚙️ [技术/UX 动作]",
      "📊 [数据与监测]",
      "🌐 [外部事件]"
    ]),
    action_summary: z.string().describe("Short summary of what was done"),
    target_pages_or_keywords: z.string().describe("Affected URL slugs or keywords"),
    hypothesis_or_goal: z.string().describe("Expected SEO outcome and causal hypothesis")
  },
  async ({ category, action_summary, target_pages_or_keywords, hypothesis_or_goal }) => {
    const result = handleLogSeoAction(category, action_summary, target_pages_or_keywords, hypothesis_or_goal);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "sync_and_deploy",
  "Stages modified blog files, commits with a message, and pushes to origin main for instant production deployment",
  {
    commit_message: z.string().describe("Git commit message (e.g. 'feat(blog): publish Qwen 3.8 integration guide')")
  },
  async ({ commit_message }) => {
    const result = handleSyncAndDeploy(commit_message);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "fetch_gsc_performance",
  "Pulls Google Search Console performance data for low-hanging fruit queries and real rankings (GSC API)",
  {
    days: z.number().optional().default(28).describe("Lookback window in days (e.g. 28)"),
    min_impressions: z.number().optional().default(1).describe("Minimum impressions threshold (default: 1)")
  },
  async ({ days, min_impressions }) => {
    const result = await handleFetchGscPerformance(days, min_impressions);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "post_publish_monitor",
  "Tracks indexing status and 14-day CTR feedback loop for a published article",
  {
    slug: z.string().describe("Article slug to monitor")
  },
  async ({ slug }) => {
    const result = await handlePostPublishMonitor(slug);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "check_page_performance",
  "Evaluates Core Web Vitals (LCP, CLS, INP) for a blog page",
  {
    slug: z.string().describe("Article slug")
  },
  async ({ slug }) => {
    const result = await handleCheckPagePerformance(slug);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "fetch_last_30_days_intelligence",
  "Scans Reddit, X/tech blogs, and Hacker News over the past 30 days for viral topics, complaints, and high-converting angles",
  {
    topic: z.string().describe("Topic or keyword to investigate across the past 30 days (e.g. 'Grok', 'Claude Code', 'Cursor')")
  },
  async ({ topic }) => {
    const result = await handleFetchLast30DaysIntelligence(topic);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool(
  "run_reed_growth_cruise",
  "Reed Autonomous Growth Hacker: Sniffs breaking model trends & 30-day pain points, audits GSC underdog queries (positions 4-15) for Top 3 promotion, and prescribes CRO micro-tools",
  {},
  async () => {
    const result = await handleRunReedGrowthCruise();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// -----------------------------------------------------------------------------
// Start Server via Stdio Transport
// -----------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 APIVALE Blog SEO MCP Server is running over stdio transport!");
}

main().catch((err) => {
  console.error("Fatal error in MCP Server:", err);
  process.exit(1);
});
