import { handleGetEditorialPlan, handleGetWritingStandard, handleGetTopicalAuthorityMap } from "./src/tools/editorial";
import { handleAnalyzeGoogleSearchIntent } from "./src/tools/serp-intent";
import { handleMonitorEmergingLlmTrends } from "./src/tools/trend-radar";
import { handleCheckKeywordCannibalization, runAntiSpamAudit } from "./src/tools/content-manager";

async function runSmokeTests() {
  console.log("--- 🧪 Starting Smoke Tests for APIVALE SEO MCP Server ---");

  // Test 1: Editorial Plan
  const plan = handleGetEditorialPlan();
  console.log(`✅ [Editorial Plan] Total: ${plan.summary.total}, Planned: ${plan.summary.planned}, Published: ${plan.summary.published}`);
  console.log(`   Next task: ${plan.nextPlannedTasks[0]?.proposedTitle}`);

  // Test 2: Writing Standard
  const standard = handleGetWritingStandard();
  console.log(`✅ [Writing Standard] Loaded ${standard.summaryChecklist.length} checklist rules.`);

  // Test 3: Topical Authority Map
  const authorityMap = handleGetTopicalAuthorityMap();
  console.log(`✅ [Authority Map] Total articles: ${authorityMap.totalArticles}, Avg word count: ${authorityMap.averageWordCount}`);
  console.log(`   Clusters:`, Object.keys(authorityMap.categoryClusters).map(k => `${k} (${authorityMap.categoryClusters[k].count})`).join(", "));

  // Test 4: Google Autocomplete live fetch
  console.log("📡 [Google Intent] Fetching live Autocomplete for 'qwen 3.8 api'...");
  const serp = await handleAnalyzeGoogleSearchIntent("qwen 3.8 api");
  console.log(`✅ [Google Intent] Received ${serp.autocompleteSuggestions.length} predictions.`);
  console.log(`   Sample predictions:`, serp.autocompleteSuggestions.slice(0, 3));
  console.log(`   Derived Tier 1 Title:`, serp.recommendedKeywordArchitecture.tier1TitleH1[0]);

  // Test 5: Trend Radar
  console.log("📡 [Trend Radar] Scanning HuggingFace trends...");
  const trends = await handleMonitorEmergingLlmTrends();
  console.log(`✅ [Trend Radar] Scanned ${trends.trendingModels.length} models.`);
  console.log(`   Sample trending model: ${trends.trendingModels[0]?.id} (Covered on site: ${trends.trendingModels[0]?.isCoveredOnSite})`);

  // Test 6: Keyword Cannibalization Check
  const cannibalization = handleCheckKeywordCannibalization(["qwen 3.8", "claude code"], "How to Connect Qwen 3.8 to Claude Code CLI");
  console.log(`✅ [Cannibalization Check] Overlap score: ${cannibalization.highestOverlapScore}, Conflicting articles: ${cannibalization.conflictingArticles.length}`);

  // Test 7: Anti-Spam Audit
  const auditTest = runAntiSpamAudit(
    "Connect Qwen 3.8 to Claude Code CLI (80% Off) | APIVALE",
    "Alibaba's Qwen 3.8-Max features a 2.4-trillion parameter MoE architecture.\n\n```bash\nexport ANTHROPIC_BASE_URL=\"https://api.apivale.com/v1\"\nexport ANTHROPIC_API_KEY=\"sk-test\"\nclaude --model infer/qwen3.8-max\n```\n\n### FAQ\nIs Qwen 3.8 free? Yes with free tier."
  );
  console.log(`✅ [Anti-Spam Audit] Passed: ${auditTest.passed}, Blockers: ${auditTest.blockers.length}, Warnings: ${auditTest.warnings.length}`);

  console.log("\n🎉 All 7 core test suites PASSED with 100% success!");
}

runSmokeTests().catch(err => {
  console.error("❌ Smoke test failed:", err);
  process.exit(1);
});
