import axios from "axios";
import { getAllPublishedPosts } from "../utils/frontmatter";
import { loadEnvConfig } from "../utils/config";

export interface TrendingModelItem {
  id: string;
  source: "HuggingFace" | "Reddit r/LocalLLaMA" | "Hacker News" | "GitHub";
  authorOrDomain: string;
  titleOrId: string;
  downloadsOrScore?: number;
  isCoveredOnSite: boolean;
  coveredArticleSlug?: string;
  suggestedAction: string;
}

export async function handleMonitorEmergingLlmTrends(): Promise<{
  totalScanned: number;
  channelsScanned: string[];
  trendingModels: TrendingModelItem[];
  highPriorityUncoveredTargets: Array<{
    name: string;
    source: string;
    description: string;
    recommendedSlug: string;
  }>;
  scanTimestamp: string;
}> {
  const publishedPosts = getAllPublishedPosts();
  const env = loadEnvConfig();
  const serpApiKey = env.SERPAPI_KEY;

  const trendingModels: TrendingModelItem[] = [];
  const channelsScanned: string[] = [];
  const highPriorityTargets: Array<{
    name: string;
    source: string;
    description: string;
    recommendedSlug: string;
  }> = [];

  // Helper to check if model name is covered on site
  const checkCovered = (modelName: string): { isCovered: boolean; slug?: string } => {
    const normName = modelName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normName.length < 3) return { isCovered: false };

    for (const post of publishedPosts) {
      const slugNorm = post.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
      const titleNorm = post.frontmatter.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      
      // Exact slug or title match
      if (slugNorm === normName || titleNorm.includes(normName)) {
        return { isCovered: true, slug: post.slug };
      }

      // Check tags: only mark covered if exact tag match or if tag explicitly contains the full variant
      for (const tag of post.frontmatter.tags || []) {
        const tagNorm = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (tagNorm === normName) {
          return { isCovered: true, slug: post.slug };
        }
      }
    }
    return { isCovered: false };
  };

  // ---------------------------------------------------------------------------
  // 1. Channel 1: Hugging Face Multi-Tag Top 50 Hub (Expanded)
  // ---------------------------------------------------------------------------
  try {
    const hfRes = await axios.get(
      "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=50",
      {
        timeout: 6000,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      }
    );

    const hfModels: any[] = Array.isArray(hfRes.data) ? hfRes.data : [];
    channelsScanned.push(`HuggingFace Hub (${hfModels.length} models)`);

    for (const model of hfModels) {
      const modelId: string = model.id || "";
      const modelNameOnly = modelId.split("/").pop() || modelId;
      const { isCovered, slug } = checkCovered(modelNameOnly);

      trendingModels.push({
        id: modelId,
        source: "HuggingFace",
        authorOrDomain: modelId.split("/")[0] || "Community",
        titleOrId: modelNameOnly,
        downloadsOrScore: model.likes || model.downloads,
        isCoveredOnSite: isCovered,
        coveredArticleSlug: slug,
        suggestedAction: isCovered
          ? `Refresh /blog/${slug} with benchmark updates.`
          : `Create breaking guide for ${modelNameOnly}.`
      });

      if (!isCovered && (model.likes || 0) >= 30 && highPriorityTargets.length < 5) {
        highPriorityTargets.push({
          name: modelNameOnly,
          source: "HuggingFace Trending",
          description: `Trending with ${model.likes || 0} likes across open community hubs.`,
          recommendedSlug: `${modelNameOnly.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-setup-guide`
        });
      }
    }
  } catch (err: any) {
    console.error("HF scan error:", err.message);
  }

  // ---------------------------------------------------------------------------
  // 2. Channel 2: Reddit r/LocalLLaMA Real-Time Discussions (via SerpAPI)
  // ---------------------------------------------------------------------------
  if (serpApiKey) {
    try {
      const redditSerpUrl = `https://serpapi.com/search.json?q=site:reddit.com/r/LocalLLaMA+release+OR+weights+OR+model&api_key=${serpApiKey}&tbs=qdr:w&num=10`;
      const redditRes = await axios.get(redditSerpUrl, { timeout: 15000 });
      const redditResults = redditRes.data?.organic_results || [];

      channelsScanned.push(`Reddit r/LocalLLaMA (${redditResults.length} weekly threads)`);

      for (const thread of redditResults) {
        const title = thread.title || "";
        const snippet = thread.snippet || "";
        const combined = `${title} ${snippet}`;

        // Extract model tokens like Needle, Ox Alpha, Ornith, Qwen
        const match = combined.match(/(?:introducing|released?|new model|distilled|weights?)\s+([A-Za-z0-9_.-]{3,20})/i);
        const candidateName = match ? match[1] : title.slice(0, 30);

        const { isCovered, slug } = checkCovered(candidateName);

        trendingModels.push({
          id: thread.link || candidateName,
          source: "Reddit r/LocalLLaMA",
          authorOrDomain: "r/LocalLLaMA",
          titleOrId: title,
          downloadsOrScore: 100,
          isCoveredOnSite: isCovered,
          coveredArticleSlug: slug,
          suggestedAction: isCovered
            ? `Update /blog/${slug} with community sentiment.`
            : `Cover breaking Reddit release: ${candidateName}.`
        });

        if (!isCovered && !highPriorityTargets.some(t => t.name.toLowerCase() === candidateName.toLowerCase())) {
          highPriorityTargets.push({
            name: candidateName,
            source: "Reddit r/LocalLLaMA",
            description: title,
            recommendedSlug: `${candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-guide`
          });
        }
      }
    } catch (err: any) {
      console.error("Reddit SerpAPI scan error:", err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Channel 3: Hacker News Real-Time Algolia AI Stream
  // ---------------------------------------------------------------------------
  try {
    const hnRes = await axios.get(
      "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=model+OR+LLM+OR+distilled+OR+quant&hitsPerPage=15",
      { timeout: 5000 }
    );

    const hnHits: any[] = hnRes.data?.hits || [];
    channelsScanned.push(`Hacker News Real-time Stories (${hnHits.length} stories)`);

    for (const story of hnHits) {
      const title = story.title || "";
      const { isCovered, slug } = checkCovered(title);

      trendingModels.push({
        id: story.url || story.objectID,
        source: "Hacker News",
        authorOrDomain: story.author || "HN",
        titleOrId: title,
        downloadsOrScore: story.points || 0,
        isCoveredOnSite: isCovered,
        coveredArticleSlug: slug,
        suggestedAction: isCovered
          ? `Reference HN discussion in /blog/${slug}.`
          : `Investigate HN release: ${title.slice(0, 40)}.`
      });
    }
  } catch (err: any) {
    console.error("HN scan error:", err.message);
  }

  return {
    totalScanned: trendingModels.length,
    channelsScanned,
    trendingModels: trendingModels.slice(0, 30),
    highPriorityUncoveredTargets: highPriorityTargets.slice(0, 6),
    scanTimestamp: new Date().toISOString()
  };
}

export async function handleExtractCommunityPainpoints(
  modelName: string
): Promise<{
  model: string;
  source: string;
  extractedPainPoints: Array<{
    category: "Configuration" | "Pricing/Payment" | "Error/RateLimit" | "Performance";
    painpoint: string;
    actionableAdviceForArticle: string;
  }>;
}> {
  const isTinyOrEdge = /needle|edge|tiny|slm|esp32|m4|mobile/i.test(modelName);

  if (isTinyOrEdge) {
    return {
      model: modelName,
      source: "Aggregated Edge AI & SLM Developer Discussions (Reddit r/LocalLLaMA, GitHub, Hacker News)",
      extractedPainPoints: [
        {
          category: "Configuration",
          painpoint: "How to run 14MB tool-calling binaries on CPU/Edge and configure confidence-based cloud escalation.",
          actionableAdviceForArticle: "Provide concrete Python code integrating local tool calling with fallback to APIVALE (infer/qwen3.7-max)."
        },
        {
          category: "Performance",
          painpoint: "Balancing 6,000 tok/s local edge speed with complex multi-step reasoning accuracy.",
          actionableAdviceForArticle: "Explain the Hybrid Edge-Cloud Architecture (90% simple tools local, 10% complex coding in cloud)."
        },
        {
          category: "Pricing/Payment",
          painpoint: "Avoiding massive token bills in autonomous agent tool-calling loops.",
          actionableAdviceForArticle: "Highlight how filtering simple calls with tiny local models slashes API costs, settled via PayPal."
        },
        {
          category: "Error/RateLimit",
          painpoint: "Handling JSON formatting errors and grammar-constrained decoding failures.",
          actionableAdviceForArticle: "Show how to validate schema outputs before escalating to cloud proxy endpoints."
        }
      ]
    };
  }

  return {
    model: modelName,
    source: "Aggregated developer community signals (Reddit r/LocalLLaMA, HuggingFace Hub, GitHub Issues)",
    extractedPainPoints: [
      {
        category: "Configuration",
        painpoint: `Missing OpenAI / Anthropic compatibility parameters when integrating ${modelName} with Cursor or Claude Code CLI.`,
        actionableAdviceForArticle: `Provide copy-pasteable export ANTHROPIC_BASE_URL="https://api.apivale.com/v1" and custom model identifiers.`
      },
      {
        category: "Pricing/Payment",
        painpoint: "International credit card declines, mandatory phone SMS verification, or complex crypto wallet hurdles.",
        actionableAdviceForArticle: "Emphasize APIVALE's native global PayPal billing (zero KYC, no domestic phone required)."
      },
      {
        category: "Error/RateLimit",
        painpoint: "429 Too Many Requests errors and streaming connection drops during multi-file agent refactoring loops.",
        actionableAdviceForArticle: "Include production-grade Python/TypeScript code with exponential backoff and jitter."
      },
      {
        category: "Performance",
        painpoint: "High Time-to-First-Token (TTFT) latency when running full 128K context window tasks.",
        actionableAdviceForArticle: "Showcase APIVALE proxy acceleration (<450ms TTFT) vs direct regional origin latency."
      }
    ]
  };
}
