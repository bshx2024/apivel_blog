#!/usr/bin/env bun
/**
 * ⚡ APIVALE Fast Trend Probe & GEO Copy Generator
 * (Inspired by TrendSpy & Master Blog Writing SOP)
 *
 * Usage:
 *   bun run scripts/fast-trend-probe.ts "openai dots"
 *   bun run scripts/fast-trend-probe.ts "qwen 3.8 max"
 */

import fs from "node:fs";
import path from "node:path";

const queryArg = process.argv.slice(2).join(" ").trim();

if (!queryArg) {
  console.log(`
Usage:
  bun run scripts/fast-trend-probe.ts "<keyword or model name>"

Example:
  bun run scripts/fast-trend-probe.ts "openai dots"
  bun run scripts/fast-trend-probe.ts "deepseek v4"
`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 1. Google Chrome Suggest Probe (Zero API Key, Real-Time Autocomplete)
// ---------------------------------------------------------------------------
async function fetchGoogleSuggests(query: string, market = "us"): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=${market}&q=${encodeURIComponent(query + " ")}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    const suggestions: string[] = Array.isArray(data?.[1]) ? data[1] : [];
    return suggestions.filter(s => s.toLowerCase() !== query.toLowerCase()).slice(0, 10);
  } catch (err: any) {
    console.warn(`[-] Failed to fetch Google suggests: ${err.message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. Commercial Intent & Negative Gossip Filter (TrendSpy Engine)
// ---------------------------------------------------------------------------
const GOSSIP_NEWS_REGEX =
  /\b(quits|quit|resigns|resigned|lawsuit|lawsuits|terminated|died|arrested|fired|salary|net worth|billionaire|legal action|scandal|dating)\b/i;

const NON_COMMERCIAL_HACKER_REGEX =
  /\b(1-bit|quantization|gguf|weights|local vram|vllm local|ollama install|huggingface weights)\b/i;

function evaluateIntent(query: string): { isCommercial: boolean; warning?: string } {
  const clean = query.toLowerCase();

  if (GOSSIP_NEWS_REGEX.test(clean)) {
    return {
      isCommercial: false,
      warning: "Detected gossip/news/personnel intent. Zero commercial API conversion value."
    };
  }

  if (NON_COMMERCIAL_HACKER_REGEX.test(clean)) {
    return {
      isCommercial: true,
      warning:
        "Warning: Detected local hardware/GGUF intent. Ensure article isolates commercial API tokens instead of diluting with local quantization benchmarks."
    };
  }

  return { isCommercial: true };
}

// ---------------------------------------------------------------------------
// 3. Automated ABC Title, H1 & Meta Description Generator
// ---------------------------------------------------------------------------
function capitalize(str: string): string {
  return str
    .split(" ")
    .map(w => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function generateCopyFramework(keyword: string, suggests: string[]) {
  const cleanKw = capitalize(keyword.trim());
  const slug = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Detect core themes in suggests
  const hasPricing = suggests.some(s => /price|pricing|cost/i.test(s));
  const hasApi = suggests.some(s => /api/i.test(s));
  const hasVs = suggests.find(s => /vs/i.test(s));
  const hasFail = suggests.some(s => /fail|error|troubleshoot|fix/i.test(s));

  // Build ABC Title: [Primary Keyword] + [Benefit / LSI] | APIVALE (50-60 chars)
  let baseTitle = `${cleanKw} API: Pricing & Setup Guide | APIVALE`;
  if (hasPricing && hasFail) {
    baseTitle = `${cleanKw} API: Pricing, Token Burn & Fail Fixes | APIVALE`;
  } else if (hasVs) {
    const vsTarget = capitalize(hasVs.replace(new RegExp(keyword, "i"), "").replace(/vs\s*/i, "").trim());
    baseTitle = `${cleanKw} API: Pricing, vs ${vsTarget} & Setup | APIVALE`;
  }

  // Ensure exact 50-60 chars
  let metaTitle = baseTitle;
  if (metaTitle.length > 60) {
    metaTitle = `${cleanKw} API: Pricing, Costs & Fixes | APIVALE`;
  }
  if (metaTitle.length > 60) {
    metaTitle = `${cleanKw} API & Pricing Guide | APIVALE`;
  }

  // H1 (<= 80 chars)
  const h1 = `${cleanKw} API, Pricing & Architecture: Production Review & Workarounds`;

  // Meta Description (140-160 chars)
  let description = `Comprehensive ${cleanKw} API review: official pricing tiers, token burn analysis, common fail fixes, and how to build cheaper persistent agents with APIVALE.`;
  if (description.length > 160) {
    description = `Comprehensive ${cleanKw} API guide: pricing tiers, silent token burn issues, sandbox fail fixes, and how to build cheaper persistent agents with APIVALE.`;
  }
  if (description.length > 160) {
    description = description.slice(0, 157) + "...";
  }

  return {
    slug,
    metaTitle,
    metaTitleLength: metaTitle.length,
    h1,
    h1Length: h1.length,
    description,
    descriptionLength: description.length
  };
}

// ---------------------------------------------------------------------------
// 4. Execution Pipeline
// ---------------------------------------------------------------------------
async function run() {
  console.log(`\n===============================================================`);
  console.log(`⚡ APIVALE Fast Trend Probe: "${queryArg}"`);
  console.log(`===============================================================\n`);

  // Intent check
  const intent = evaluateIntent(queryArg);
  if (!intent.isCommercial) {
    console.log(`❌ Commercial Intent Check FAILED: ${intent.warning}\n`);
    return;
  }
  if (intent.warning) {
    console.log(`⚠️ Commercial Intent Warning: ${intent.warning}\n`);
  } else {
    console.log(`✅ Commercial Intent Verified: High transaction/setup suitability.\n`);
  }

  // Probe Google
  console.log(`🔍 Probing Google Chrome Suggest in real-time...`);
  const suggests = await fetchGoogleSuggests(queryArg);
  console.log(`\n📌 Google Autocomplete Top Suggestions (${suggests.length}):`);
  suggests.forEach((s, i) => console.log(`   ${i + 1}. "${s}"`));

  // Generate Copy Framework
  const copy = generateCopyFramework(queryArg, suggests);

  console.log(`\n---------------------------------------------------------------`);
  console.log(`📐 Standardized GEO Frontmatter & Headings:`);
  console.log(`---------------------------------------------------------------`);
  console.log(`Target Slug: /blog/${copy.slug}/`);
  console.log(`Meta Title:  "${copy.metaTitle}" (${copy.metaTitleLength} chars, optimal 50-60)`);
  console.log(`H1 Tag:      "${copy.h1}" (${copy.h1Length} chars, optimal <= 80)`);
  console.log(`Description: "${copy.description}" (${copy.descriptionLength} chars, optimal 140-160)`);

  console.log(`\n📋 Ready-to-Drop Frontmatter Scaffold:`);
  console.log(`---------------------------------------------------------------`);
  console.log(`---
title: "${copy.h1}"
metaTitle: "${copy.metaTitle}"
description: "${copy.description}"
date: "${new Date().toISOString().split("T")[0]}"
author: "Alex Rivera"
authorTitle: "Senior Cloud Architect & API Integrations, APIVALE"
tags: ["${capitalize(queryArg)}", "${capitalize(queryArg)} API", "DeepSeek V4", "Qwen 3.7 Max", "APIVALE", "PayPal"]
keyTakeaways:
  - label: "API Protocol"
    value: "OpenAI-Compatible (/v1/chat/completions)"
    isCode: true
  - label: "Target Models"
    value: "infer/deepseek-v4 & infer/qwen3.7-max"
    isCode: true
  - label: "Integration Endpoint"
    value: "https://apivel.com/v1"
    isCode: true
  - label: "Billing & Trial"
    value: "PayPal & Global Cards ($0.20 Free Trial)"
    highlight: true
---
`);

  console.log(`\n🌳 Recommended 3-Tier Keyword Architecture:`);
  console.log(`  • Tier 1 (Title/H1): ${queryArg}, ${queryArg} api, ${queryArg} pricing`);
  console.log(`  • Tier 2 (H2 Modules):`);
  suggests.slice(0, 4).forEach(s => console.log(`      - H2: ${capitalize(s)}`));
  console.log(`  • Tier 3 (Conversion & CTA): OpenAI-compatible baseURL, $0.20 trial, PayPal instant billing`);
  console.log(`\n===============================================================\n`);
}

run();
