import axios from "axios";
import { loadEnvConfig } from "../utils/config";

export interface SerpIntentResult {
  query: string;
  market: string;
  autocompleteSuggestions: string[];
  recommendedKeywordArchitecture: {
    tier1TitleH1: string[];
    tier2H2Subtopics: string[];
    tier3FaqQuestions: string[];
  };
  note: string;
}

export async function handleAnalyzeGoogleSearchIntent(
  query: string,
  market = "us"
): Promise<SerpIntentResult> {
  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=${market}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    // Google returns format: [query, [suggestions...], [descriptions...], ...]
    const rawSuggestions: string[] =
      Array.isArray(response.data) && Array.isArray(response.data[1])
        ? response.data[1]
        : [];

    // Filter and clean suggestions
    const suggestions = rawSuggestions.filter(
      s => typeof s === "string" && s.trim().length > 0
    );

    // Derive 3-tier keyword architecture mapping
    const titleCandidates: string[] = [];
    const h2Candidates: string[] = [];
    const faqCandidates: string[] = [];

    for (const sug of suggestions) {
      const lower = sug.toLowerCase();
      if (
        lower.startsWith("how to") ||
        lower.includes("setup") ||
        lower.includes("connect")
      ) {
        titleCandidates.push(sug);
      } else if (
        lower.includes("vs") ||
        lower.includes("pricing") ||
        lower.includes("cost") ||
        lower.includes("benchmarks")
      ) {
        h2Candidates.push(sug);
      } else if (
        lower.startsWith("is ") ||
        lower.startsWith("what ") ||
        lower.startsWith("why ") ||
        lower.includes("free")
      ) {
        faqCandidates.push(
          sug.endsWith("?") ? sug : `${sug.charAt(0).toUpperCase() + sug.slice(1)}?`
        );
      } else {
        h2Candidates.push(sug);
      }
    }

    // Ensure fallback items if Google suggestions are skewed
    if (titleCandidates.length === 0 && suggestions.length > 0) {
      titleCandidates.push(`How to Use ${query} (Setup & Cost Guide)`);
    }
    if (faqCandidates.length === 0) {
      faqCandidates.push(
        `Is ${query} free to use?`,
        `How to get an API key for ${query} with PayPal?`,
        `What are the rate limits for ${query}?`
      );
    }

    return {
      query,
      market,
      autocompleteSuggestions: suggestions,
      recommendedKeywordArchitecture: {
        tier1TitleH1: titleCandidates.slice(0, 3),
        tier2H2Subtopics: h2Candidates.slice(0, 5),
        tier3FaqQuestions: faqCandidates.slice(0, 4)
      },
      note: "Data fetched in real-time from Google Autocomplete. Suggestions reflect actual high-frequency user search intent."
    };
  } catch (error: any) {
    return {
      query,
      market,
      autocompleteSuggestions: [
        `${query} pricing`,
        `${query} claude code setup`,
        `${query} cursor setup`,
        `${query} api key paypal`,
        `how to connect ${query}`
      ],
      recommendedKeywordArchitecture: {
        tier1TitleH1: [`How to Connect ${query} (Save 80% Token Spend)`],
        tier2H2Subtopics: [
          `${query} Pricing & Token Cost Breakdown`,
          `Configuring ${query} with Custom Base URL`,
          `Common Rate Limit Errors and Fixes`
        ],
        tier3FaqQuestions: [
          `Is ${query} free to use?`,
          `How to buy ${query} API credits with PayPal?`
        ]
      },
      note: `Fallback generated due to network warning: ${error?.message || "fetch timeout"}`
    };
  }
}

export async function handleAnalyzeSerpCompetitors(
  keyword: string
): Promise<{
  configured: boolean;
  keyword: string;
  topCompetitors?: Array<{ title: string; link: string; snippet: string }>;
  contentGapAnalysis?: {
    mustCoverTopics: string[];
    suggestedInformationGainPoints: string[];
  };
  guidance?: string;
}> {
  const env = loadEnvConfig();
  const apiKey = env.SERPAPI_KEY;

  if (!apiKey) {
    return {
      configured: false,
      keyword,
      guidance:
        "SerpAPI Key is not configured. To enable live competitor extraction, set SERPAPI_KEY in .env.mcp. In Phase 1, use analyze_google_search_intent for 100% free Google Autocomplete intent mapping."
    };
  }

  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${apiKey}&engine=google&gl=us&hl=en&num=5`;
    const res = await axios.get(url, { timeout: 8000 });
    const organic = (res.data?.organic_results || []).slice(0, 5);

    const competitors = organic.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    return {
      configured: true,
      keyword,
      topCompetitors: competitors,
      contentGapAnalysis: {
        mustCoverTopics: [
          "Step-by-step terminal and IDE configuration commands",
          "Official pricing vs proxy token discount math",
          "401/429 status code handling with backoff code"
        ],
        suggestedInformationGainPoints: [
          "Direct PayPal global billing proof without KYC",
          "15+ line retry interceptor for Claude Code CLI and Cursor"
        ]
      }
    };
  } catch (err: any) {
    return {
      configured: true,
      keyword,
      guidance: `SerpAPI request failed: ${err.message}`
    };
  }
}
