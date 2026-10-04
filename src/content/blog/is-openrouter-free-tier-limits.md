---
title: "OpenRouter Free Tier: 50 RPD Daily Limits, Models List & Upstream 429 Fix"
metaTitle: "OpenRouter Free Tier Limits: 50 RPD & Models | APIVALE"
description: "Is OpenRouter free? Discover true 50 daily request limits, token context caps on :free models, upstream 429 errors, and how to get free API testing credits."
date: "2026-09-30"
author: "Sofia Costa"
authorTitle: "Senior Cloud Infrastructure Engineer, APIVALE"
authorBio: "Sofia Costa is a Senior Cloud Infrastructure Engineer at APIVALE specializing in multi-provider API gateways, rate-limiting architectures, and high-throughput LLM routing."
tags: ["OpenRouter", "OpenRouter Free Tier", "OpenRouter Free Tier Limit", "OpenRouter Free Tier Models", "OpenRouter Free Tier Token Limit", "OpenRouter Free Tier Daily", "API Rate Limits", "LLM Routing", "AI Gateway", "PayPal", "APIVALE"]
image: "/blog/og-cover.png"
lang: "en"
keyTakeaways:
  - label: "Access Tier"
    value: "OpenRouter Free Tier (`:free`) vs Paid"
  - label: "Daily Rate Limit"
    value: "50 Requests/Day (Under $10 Lifetime Balance)"
    highlight: true
  - label: "Token Limit / Context"
    value: "Varies by Provider (Truncated at 8K–16K Tokens)"
  - label: "Production Gateway"
    value: "PayPal & Global Cards ($0.20 Free Trial)"
---

<div class="my-6 border-l-4 border-emerald-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Takeaways</span>
  <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-gray-300">
    <li><strong>OpenRouter Free Tier Reality:</strong> Is OpenRouter free? Yes, but only for open-source AI models tagged with <code>:free</code>. Commercial frontier models (Claude Sonnet 5, DeepSeek V4) require paid deposits.</li>
    <li><strong>The 50 RPD Quota Gate:</strong> Accounts with under $10 in lifetime purchases are capped at <strong>50 requests per day (RPD)</strong> and <strong>20 requests per minute (RPM)</strong> across all API keys.</li>
    <li><strong>Token Context & Output Caps:</strong> Free models suffer from unadvertised context truncation (often 8K–16K tokens) and 2,048-token generation limits imposed by upstream hosts.</li>
    <li><strong>Upstream Throttling:</strong> Free AI endpoints rely on third-party crowd-sourced servers that frequently return <code>HTTP 429 Too Many Requests</code> during peak US coding agent hours.</li>
    <li><strong>Zero-Card Testing Alternative:</strong> Test production-grade models immediately without deposit locks by claiming <a href="https://apivale.com/sign-up?redirect=/blog/is-openrouter-free-tier-limits/" class="text-emerald-400 hover:underline font-semibold">APIVALE's $0.20 Free Starter Credit (100,000 Tokens)</a> with instant PayPal zero-FX billing.</li>
  </ul>
</div>

<div class="my-6 border border-indigo-500/30 bg-indigo-950/20 rounded-xl p-5 shadow-lg">
  <div class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Definition: OpenRouter Free Tier</div>
  <p class="text-sm text-gray-300 leading-relaxed">
    The <strong>OpenRouter Free Tier</strong> is a freemium API routing service that lets developers query designated open-weight LLMs at zero token cost. However, it enforces platform concurrency caps (20 RPM), a strict 50-to-1,000 daily request ceiling governed by account deposit history, upstream token context truncation, and no guaranteed uptime SLA.
  </p>
</div>

Developers building autonomous coding agents or terminal workflows frequently ask: **is OpenRouter free?** Browsing the catalog reveals popular architectures like Llama and Qwen tagged with `:free`. 

However, integrating these endpoints into Cursor IDE or Cline often leads to immediate `HTTP 429 Too Many Requests` errors and daily quota lockouts. For developers configuring IDE workflows, see our comparative breakdown on [Cursor BYOK vs Pro Real Cost](/blog/cursor-pro-vs-custom-api-key/) to evaluate pay-as-you-go keys against flat subscriptions.

Evaluating free tier quotas is essential for continuous agent execution. Teams implementing [LLM cost optimization strategies](/blog/llm-cost-optimization-guide/) must look beyond the "$0" tag to evaluate real-world developer friction and consider high-throughput [OpenRouter alternatives](/blog/openrouter-alternatives/).

This technical audit breaks down the **OpenRouter free tier**, its 50 RPD quota gate, upstream throttling dynamics, privacy policies, and how to transition to a reliable developer gateway.

---

## 1. Quick Answer: Is OpenRouter Free to Use?

OpenRouter operates as a **hybrid multi-model marketplace** rather than a completely free service:

1. **OpenRouter Free Tier Endpoints (`:free`):** Specific open-weight AI architectures (such as `meta-llama/llama-3.3-70b-instruct:free` and `qwen/qwen-2.5-72b-instruct:free`) can be queried with $0 token charges.
2. **Paid Commercial Endpoints:** Frontier proprietary models—including Claude Sonnet 5, OpenAI GPT models, and DeepSeek V4—require purchased credits.
3. **No Complimentary Wallet Credits:** OpenRouter does not give free signup credits. Testing commercial models requires an upfront deposit subject to card processing fees.

To calculate commercial token costs once you outgrow free trial limits, use our live [OpenRouter Pricing & Live Token Calculator](https://apivale.com/openrouter-pricing/) for real-time per-million token breakdowns.

---

## 2. OpenRouter Free Tier Limits: The 50-Request Gate & Upstream 429 Errors

While token consumption is free on designated endpoints, query throughput is governed by restrictive platform gates and hosting caps.

### Platform-Level Quota Tiers (Daily & Rate Limits)

The OpenRouter free tier enforces strict rate limits determined by your lifetime deposit volume:

* **Under $10 Lifetime Account Purchases:** New or unpaid accounts are limited to **50 requests per day (RPD)** and **20 requests per minute (RPM)**.
* **Over $10 Lifetime Account Purchases:** Depositing at least $10 expands daily capacity to **1,000 requests per day (RPD)** while maintaining the 20 RPM ceiling.
* **Global Account Enforcement:** These rate limits apply globally to your entire account. Generating multiple API keys does not multiply your daily allotment.

For an autonomous agent running multi-file AST parses or iterative test cycles in Cursor, 50 requests can be exhausted in less than 15 minutes.

### Upstream Host 429 Throttling

Even when you are well below your 50 daily requests, you may experience unexpected `HTTP 429` errors. 

OpenRouter does not run its own GPU clusters for open-source weights. Queries are dispatched to third-party hosting partners (such as DeepInfra, Together AI, or community hosts). During peak traffic windows, these upstream providers prioritize their direct paying customers by throttling or dropping free pool requests.

<div class="my-6 border-l-4 border-amber-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Primary-Source Community Voice: The Free Quota Bottleneck</span>
  <p class="mt-2 text-sm italic text-gray-300">
    "Trying to run an open-weights model on OpenRouter's free tier inside RooCode or Cline is almost impossible during daytime hours. After two prompt turns, you hit '429 Rate limit exceeded: free tier overloaded'. Even with retry sleeps, upstream hosts simply drop the free queue."
  </p>
  <div class="mt-3 text-xs text-gray-400">
    — Verified Developer Discussion on <a href="https://www.reddit.com/r/LocalLLaMA/" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline">Reddit r/LocalLLaMA</a> regarding agent rate limits
  </div>
</div>

### OpenRouter Free Tier Token Limits & Context Caps

A common misconception among developers querying **openrouter free tier token limit** is assuming free endpoints inherit the full theoretical context window of the underlying weights.

In practice, OpenRouter's free tier token handling exhibits two major operational constraints:
1. **Truncated Context Windows:** While open weights like Llama 3.3 natively support 128,000 tokens, upstream community hosts serving `:free` endpoints frequently throttle context windows to 8,192 or 16,384 tokens to preserve GPU VRAM. Submitting prompts larger than the host's unadvertised cap returns prompt truncation errors or `HTTP 400 Bad Request`.
2. **Strict Output Token Ceilings:** Most free-tier providers cap `max_tokens` (generation length) between 2,048 and 4,096 tokens. For agentic code generators running file-write operations, responses are frequently cut off mid-stream without a clean completion token.

---

## 3. Best Free LLM Models on OpenRouter & Production Tradeoffs

When compute slots are available, several open-weight AI models on the OpenRouter free tier provide strong baseline capabilities.

### Active OpenRouter Free Tier Models List

Below is the verified list of active `:free` models available on the OpenRouter free tier, their model IDs, advertised context windows, and real-world stability:

| Model Name | OpenRouter Model ID (`:free`) | Max Context Window | Upstream Provider Type | Production Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Meta Llama 3.3 70B Instruct** | `meta-llama/llama-3.3-70b-instruct:free` | Up to 128K (Often capped to 16K) | Community / Shared Hosts | Prototyping & text reasoning |
| **Qwen 2.5 72B Instruct** | `qwen/qwen-2.5-72b-instruct:free` | Up to 32K | Third-Party GPU Donors | Multi-language & math tasks |
| **Meta Llama 3.1 8B Instruct** | `meta-llama/llama-3.1-8b-instruct:free` | 128K | Distributed Inference | Low-latency tests & formatting |
| **Mistral 7B Instruct** | `mistralai/mistral-7b-instruct:free` | 32K | Shared Host Pool | Casual chat & simple summarization |
| **Google Gemma 2 9B** | `google/gemma-2-9b-it:free` | 8K | Community Endpoints | Basic experimentation |

*Note: Free model availability and upstream hosting latency fluctuate continuously. Endpoints tagged with `:free` carry zero uptime SLAs and may be removed or replaced without notice.*

### Objective Comparison: Free Tier vs. Dedicated Commercial Gateway

| Evaluation Metric | OpenRouter Free Tier (`:free`) | OpenRouter Paid Tier | APIVALE Developer Gateway | Best Choice For... |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Request Ceiling** | 50 RPD (&lt;$10) / 1,000 RPD (&gt;$10) | Balance-dependent | Unlimited (No daily gates) | **APIVALE** (Continuous CI/CD) |
| **Concurrency Ceiling** | 20 RPM | Provider-dependent | 300+ RPM adaptive | **APIVALE** (Agentic Loops) |
| **Peak-Hour Stability** | Frequent 429 drops | Standard Multi-Provider | 99.95% Multi-Cloud Failover | **OpenRouter Paid / APIVALE** |
| **Flagship Availability** | Open-source only | Full Catalog | Claude 3.7/Sonnet 5, DeepSeek V4 | **APIVALE** (Production SWE) |
| **Free Starter Quota** | $0 credits (50 req/day) | $0 credits | **$0.20 Trial (100,000 Tokens)** | **APIVALE** (Zero-Risk Evaluation) |
| **Billing Surcharges** | None ($0) | 5.5% Credit Card Fee | **0% PayPal & Global Cards** | **APIVALE** (Zero-Friction Billing) |
| *Verified Audit Date* | *September 30, 2026* | *September 30, 2026* | *September 30, 2026* | *Updated Live* |

---

## 4. Are OpenRouter Free Endpoints Safe for Private Code?

Engineering teams often question whether prompt data sent through the OpenRouter free tier remains private.

OpenRouter disables **Input and Output Logging** by default in platform settings. However, because requests are fulfilled by varied third-party hosts, data retention policies depend on the upstream provider:
* Community hosts providing free compute may log anonymized requests for research or model training.
* Guaranteed **Zero Data Retention (ZDR)** filtering is primarily supported on commercial enterprise routing paths.

For proprietary codebases or sensitive business logic, free shared endpoints introduce compliance unpredictability.

---

## 5. Interactive Quota Calculator: Free Limit Burn Rate

Simulate how quickly your development workflow will hit the 50 RPD limit on the OpenRouter free tier:

<div class="my-6 p-6 bg-gray-900 border border-emerald-500/40 rounded-xl shadow-xl">
  <div class="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">⚡ OpenRouter Free Tier Quota Simulator</div>
  <p class="text-xs text-gray-400 mb-4">Evaluate whether the 50 RPD free tier limit can support your daily workflow.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label class="block text-xs font-semibold text-gray-300 mb-1" for="calc-agent-type">Workflow Mode</label>
      <select id="calc-agent-type" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500">
        <option value="5">Casual Chat (5 requests/hr)</option>
        <option value="25" selected>Cursor Composer Coding (25 requests/hr)</option>
        <option value="60">Autonomous Agent / Cline (60 requests/hr)</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold text-gray-300 mb-1" for="calc-active-hours">Active Hours Per Day</label>
      <input type="number" id="calc-active-hours" value="4" min="1" max="24" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500" />
    </div>
  </div>

  <button type="button" id="calc-run-btn" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
    Calculate Daily Exhaustion Point
  </button>

  <div id="calc-result" class="mt-4 p-4 bg-gray-800/80 rounded border border-gray-700 text-sm text-gray-300 hidden">
    <div class="font-bold text-white mb-1" id="calc-status">Analysis Result</div>
    <div class="text-xs space-y-1" id="calc-details"></div>
  </div>
</div>

<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('calc-run-btn');
    const resultBox = document.getElementById('calc-result');
    const statusEl = document.getElementById('calc-status');
    const detailsEl = document.getElementById('calc-details');

    if (btn && resultBox && statusEl && detailsEl) {
      btn.addEventListener('click', () => {
        const reqsPerHour = parseInt(document.getElementById('calc-agent-type').value, 10);
        const hours = parseInt(document.getElementById('calc-active-hours').value, 10);
        const totalRequests = reqsPerHour * hours;
        
        resultBox.classList.remove('hidden');
        if (totalRequests > 50) {
          const minutesToExhaust = Math.round((50 / reqsPerHour) * 60);
          statusEl.textContent = '❌ Free Tier Limit Exceeded';
          statusEl.className = 'font-bold text-rose-400 mb-1';
          detailsEl.innerHTML = `
            <div>Total Daily Demands: <strong>${totalRequests} requests</strong></div>
            <div>Free Tier Lifetime (&lt;$10) Cap: <strong>50 requests</strong></div>
            <div class="text-amber-300 mt-1">⚠️ You will hit 429 rate limit errors in approximately <strong>${minutesToExhaust} minutes</strong>.</div>
            <div class="mt-2 text-gray-300">Recommended Solution: Switch to an unrestricted developer gateway with PayPal instant billing and zero minimum deposit penalties.</div>
          `;
        } else {
          statusEl.textContent = '✓ Within Theoretical Free Limits';
          statusEl.className = 'font-bold text-emerald-400 mb-1';
          detailsEl.innerHTML = `
            <div>Total Daily Demands: <strong>${totalRequests} requests</strong> (Under 50 RPD cap).</div>
            <div>Note: You remain vulnerable to upstream peak-hour 429 throttles from shared community providers.</div>
          `;
        }
      });
    }
  });
</script>

---

## 6. Production Failover Router: Handling Free-Tier 429 Errors Gracefully

To combine free tier experimentation with production stability, configure automated retry logic and transparent failover:

```typescript
import { OpenAI } from "openai";

export class ResilientGatewayRouter {
  private freeClient = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_KEY });
  private prodClient = new OpenAI({ baseURL: "https://api.apivale.com/v1", apiKey: process.env.APIVALE_KEY });

  async completePrompt(prompt: string): Promise<string> {
    try {
      // Step 1: Attempt execution on free tier endpoint
      const res = await this.freeClient.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      });
      return res.choices[0]?.message?.content || "";
    } catch (err: any) {
      // Step 2: Instant automatic failover on 429 or 5xx to APIVALE Production
      if (err?.status === 429 || err?.status >= 500) {
        console.warn("[Failover] Free tier throttled. Routing to APIVALE Gateway...");
        const fallback = await this.prodClient.chat.completions.create({
          model: "deepseek-v4",
          messages: [{ role: "user", content: prompt }],
        });
        return fallback.choices[0]?.message?.content || "";
      }
      throw err;
    }
  }
}
```

---

## 7. Beyond the Free Tier: Transparent Production Gateway

When your application requires high concurrency, proprietary code confidentiality, or flagship reasoning (Claude Sonnet 5 or DeepSeek V4), upgrading to a paid tier is necessary.

OpenRouter charges standard token rates with a **5.5% credit card deposit fee**. Conversely, **APIVALE** provides an agile, developer-first alternative:
* **$0.20 Free Starter Credit (100,000 Tokens):** Test production models instantly with zero credit card entry.
* **PayPal Instant Checkout:** Top up exact amounts via PayPal, Apple Pay, or Alipay with 0% extra conversion fees.
* **Unified Dual-Protocol Compatibility:** Connect to Cursor, Windsurf, and Claude Code CLI with native OpenAI and Anthropic SDK support.

Compare exact model pricing on our standalone [OpenRouter Pricing Breakdown & Calculator](https://apivale.com/openrouter-pricing/) to evaluate real production token savings.

---

## Frequently Asked Questions

### What is the cheapest OpenRouter model?
The cheapest models on OpenRouter cost between $0.02 to $0.05 per 1M tokens (such as DeepSeek V3/V4, Meta Llama 3.1 8B, and Qwen 2.5 7B on paid hosting endpoints). While `:free` models cost $0 per token, their 50 requests/day cap and frequent 429 drops make low-cost paid models far more dependable for agentic development.

### What are the features of the OpenRouter 10 dollar tier?
The "10 dollar tier" refers to accounts that have purchased at least $10 in lifetime credits. Depositing $10 does not provide $10 of free credits; instead, it raises your daily throughput on `:free` models from 50 requests per day (RPD) to 1,000 RPD, while maintaining the concurrency cap at 20 requests per minute (RPM).

### What is the token limit on the OpenRouter free tier?
OpenRouter free tier endpoints do not have an explicit monthly token quota, but query volume is strictly bounded by the 50 RPD gate (or 1,000 RPD if over $10 deposited). Additionally, individual requests on free models are subject to upstream context truncation (typically 8,192 to 16,384 tokens) and output generation limits of 2,048 to 4,096 tokens.

### Do I need to pay for an OpenRouter?
You do not need to pay if you exclusively query open-weight models tagged with `:free` and stay under 50 requests per day. However, accessing proprietary frontier models (like Claude Sonnet 5 or OpenAI GPT models) or exceeding the 50 daily request cap requires purchasing credits, which incurs a 5.5% credit card deposit surcharge.

### Is OpenRouter worth it?
OpenRouter is worth it for developers prototyping simple prompts across varied open-source models under a single interface. However, for continuous autonomous coding agents in Cursor or Claude Code, frequent 429 timeouts and 5.5% deposit fees make dedicated developer gateways like APIVALE (with instant PayPal billing and 99.95% multi-cloud failover) significantly more stable.

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the cheapest OpenRouter model?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The cheapest models on OpenRouter cost $0.02 to $0.05 per 1M tokens (e.g. DeepSeek V3/V4 and Llama 3.1 8B). Free tier models cost $0 but enforce a 50 requests/day ceiling."
      }
    },
    {
      "@type": "Question",
      "name": "What are the features of the OpenRouter 10 dollar tier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Depositing $10 unlocks 1,000 requests per day (RPD) on free-tier models (up from 50 RPD), while maintaining the 20 RPM concurrency limit."
      }
    },
    {
      "@type": "Question",
      "name": "What is the token limit on the OpenRouter free tier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free endpoints are constrained by 50 RPD, upstream context truncation (typically 8K-16K tokens), and maximum output caps of 2,048 to 4,096 tokens."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to pay for an OpenRouter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Payment is only required when accessing commercial frontier models (Claude, OpenAI) or exceeding the 50 free daily request limit."
      }
    },
    {
      "@type": "Question",
      "name": "Is OpenRouter worth it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OpenRouter is good for casual experimentation, but persistent 429 throttles and 5.5% card fees make gateways like APIVALE with PayPal billing more reliable for production agents."
      }
    }
  ]
}
</script>

<div class="my-8 rounded-xl bg-gray-900 border border-gray-800 p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Related Guides in the OpenRouter &amp; Gateway Cluster</span>
  <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
    <a href="/blog/openrouter-alternatives/" class="text-gray-300 hover:text-emerald-400 font-medium transition-colors">→ OpenRouter Alternatives: Wholesale Pricing &amp; No-Card Gateways</a>
    <a href="/blog/cursor-pro-vs-custom-api-key/" class="text-gray-300 hover:text-emerald-400 font-medium transition-colors">→ Cursor BYOK vs Pro: Real Cost &amp; Setup Guide</a>
    <a href="/blog/opencode-paypal-billing-api-proxy-guide/" class="text-gray-300 hover:text-emerald-400 font-medium transition-colors">→ OpenCode PayPal Billing &amp; Proxy Setup Guide</a>
    <a href="/blog/llm-cost-optimization-guide/" class="text-gray-300 hover:text-emerald-400 font-medium transition-colors">→ Enterprise LLM Cost Optimization Strategies</a>
  </div>
</div>

<div class="my-8 rounded-2xl bg-gradient-to-br from-gray-900 via-indigo-950/40 to-gray-900 border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden">
  <div class="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="relative z-10">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/30">
      <span>🎁 Zero-Risk Engineering Gateway</span>
    </div>
    <div class="text-2xl font-bold text-white mb-2">Tired of Free-Tier 429 Throttles & 5.5% Deposit Fees?</div>
    <p class="text-sm text-gray-300 mb-6 max-w-2xl leading-relaxed">
      Scale beyond OpenRouter's 50-request daily limit. Connect Claude Code CLI, Cursor, and Windsurf directly to official flagship models with instant PayPal zero-FX billing, 99.95% multi-cloud uptime, and permanent volume bonuses.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
        <div class="text-indigo-400 font-bold text-sm">🎁 $0.20 Free Trial</div>
        <div class="text-xs text-gray-400 mt-1">100,000 tokens on signup. Zero credit card or KYC needed.</div>
      </div>
      <div class="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
        <div class="text-emerald-400 font-bold text-sm">⚡ +50% First Deposit</div>
        <div class="text-xs text-gray-400 mt-1">Deposit $5 → Get $7.50 balance. Deposit $29 → Get $43.50.</div>
      </div>
      <div class="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
        <div class="text-purple-400 font-bold text-sm">💳 PayPal & Zero FX</div>
        <div class="text-xs text-gray-400 mt-1">Pay with PayPal, Apple Pay, or Alipay with 0% extra surcharges.</div>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 items-center">
      <a href="https://apivale.com/sign-up?redirect=/blog/is-openrouter-free-tier-limits/" class="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20">
        Claim $0.20 Free Credit (Instant Activation) →
      </a>
      <a href="https://apivale.com/pricing?redirect=/blog/is-openrouter-free-tier-limits/" class="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm transition-all border border-gray-600">
        View Live Pricing & Deposit Tiers
      </a>
    </div>
  </div>
</div>
