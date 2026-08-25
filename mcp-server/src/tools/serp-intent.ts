import axios from "axios";
import { loadEnvConfig } from "../utils/config";

export interface SerpIntentResult {
  query: string;
  market: string;
  autocompleteSuggestions: string[];
  peopleAlsoAsk?: string[];
  relatedSearches?: string[];
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
  const env = loadEnvConfig();
  const serpApiKey = env.SERPAPI_KEY;

  let paaQuestions: string[] = [];
  let relatedSearches: string[] = [];

  // If SerpAPI is configured, fetch live PAA & Related Searches
  if (serpApiKey) {
    try {
      const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&engine=google&gl=${market}&hl=en&num=5`;
      const serpRes = await axios.get(serpUrl, { timeout: 8000 });
      
      paaQuestions = (serpRes.data?.related_questions || [])
        .map((q: any) => q.question)
        .filter(Boolean);

      relatedSearches = (serpRes.data?.related_searches || [])
        .map((r: any) => r.query)
        .filter(Boolean);
    } catch {
      // Graceful fallback to Autocomplete
    }
  }

  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=${market}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const rawSuggestions: string[] =
      Array.isArray(response.data) && Array.isArray(response.data[1])
        ? response.data[1]
        : [];

    const suggestions = rawSuggestions.filter(
      s => typeof s === "string" && s.trim().length > 0
    );

    const titleCandidates: string[] = [];
    const h2Candidates: string[] = [];
    const faqCandidates: string[] = [...paaQuestions];

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

    if (relatedSearches.length > 0) {
      h2Candidates.push(...relatedSearches.slice(0, 4));
    }

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
      peopleAlsoAsk: paaQuestions.slice(0, 5),
      relatedSearches: relatedSearches.slice(0, 6),
      recommendedKeywordArchitecture: {
        tier1TitleH1: titleCandidates.slice(0, 3),
        tier2H2Subtopics: [...new Set(h2Candidates)].slice(0, 6),
        tier3FaqQuestions: [...new Set(faqCandidates)].slice(0, 4)
      },
      note: serpApiKey 
        ? "Enriched in real-time with Google Autocomplete + SerpAPI (Live PAA & Related Searches)."
        : "Data fetched in real-time from Google Autocomplete."
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
  peopleAlsoAsk?: string[];
  relatedSearches?: string[];
  contentGapAnalysis?: {
    competitorCoveredThemes: string[];
    apivaleWinningAngles: string[];
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
        "SerpAPI Key is not configured. Set SERPAPI_KEY in .env.mcp to enable live competitor extraction."
    };
  }

  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${apiKey}&engine=google&gl=us&hl=en&num=5`;
    const res = await axios.get(url, { timeout: 10000 });
    const organic = (res.data?.organic_results || []).slice(0, 5);

    const competitors = organic.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet || ""
    }));

    const paa = (res.data?.related_questions || []).map((q: any) => q.question).filter(Boolean);
    const related = (res.data?.related_searches || []).map((r: any) => r.query).filter(Boolean);

    return {
      configured: true,
      keyword,
      topCompetitors: competitors,
      peopleAlsoAsk: paa,
      relatedSearches: related,
      contentGapAnalysis: {
        competitorCoveredThemes: [
          "Basic model release announcements and parameter counts",
          "Generic benchmark scores without reproducible test commands",
          "Official cloud pricing without proxy cost arbitrage"
        ],
        apivaleWinningAngles: [
          "Zero-KYC global PayPal billing vs international credit card failure",
          "Concrete 15+ line Python retry script with exponential backoff for 429 errors",
          "Sub-450ms TTFT proxy routing with Claude Code CLI and Cursor IDE one-click configs"
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
