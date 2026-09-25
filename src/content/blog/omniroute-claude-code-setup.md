---
title: "OmniRoute Setup with Claude Code: 3-Step Guide (and When to Skip It)"
metaTitle: "OmniRoute Setup with Claude Code: Install & Review | APIVALE"
description: "Master OmniRoute setup with Claude Code via npm or Docker. Compare local proxy latency, CVE risks, and unthrottled APIVALE PayPal fallback for coding agents."
date: "2026-09-25"
author: "Sofia Costa"
authorTitle: "FinTech Integration & API Security Expert, APIVALE"
authorBio: "Sofia Costa specializes in API gateway security, enterprise proxy hardening, and seamless global checkout architectures."
tags: ["OmniRoute setup claude code", "OmniRoute Claude Code", "OmniRoute setup", "OmniRoute Docker", "Claude Code install", "OmniRoute online", "AI Gateway", "APIVALE", "PayPal"]
image: "/blog/og-cover.png"
lang: "en"
keyTakeaways:
  - label: "Target Keyword"
    value: "OmniRoute Setup with Claude Code"
    isCode: false
  - label: "Default Local Endpoint"
    value: "http://localhost:20128/v1"
    isCode: true
  - label: "Target Workflows"
    value: "Claude Code CLI, Cursor, Cline, Copilot"
  - label: "Billing & Fallback"
    value: "PayPal & Global Cards ($0.20 Trial)"
    highlight: true
---

<div class="my-6 border-l-4 border-emerald-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Takeaways</span>
  <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-gray-300">
    <li><strong>OmniRoute Setup with Claude Code:</strong> Redirect your terminal agent to <code>http://localhost:20128/v1</code> using environment variables to pool free model quotas and bypass Anthropic 5-hour rate limits.</li>
    <li><strong>Local Daemon Installation:</strong> Deploy OmniRoute in under two minutes via npm or isolated Docker containers without altering your repository structure.</li>
    <li><strong>Token Compression Trade-Offs:</strong> Built-in RTK and Caveman pipelines reduce context size by 15% to 90%, but aggressive semantic pruning can degrade syntax accuracy during complex code refactoring.</li>
    <li><strong>Zero-DevOps Cloud Alternative:</strong> Skip Docker daemon overhead, local port-binding CVE risks, and expired provider keys by falling back to <a href="https://apivale.com/sign-up?redirect=/blog/omniroute-claude-code-setup/" class="text-emerald-400 hover:underline font-semibold">APIVALE (Claim $0.20 Free Credit)</a> with PayPal instant checkout and 99.99% enterprise uptime.</li>
  </ul>
</div>

<div class="my-4 border-l-4 border-cyan-500 bg-gray-900/90 rounded-r-lg p-4">
  <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">Related Agent & Gateway Architecture Guides</span>
  <p class="mt-1 text-sm text-gray-300">
    Configuring high-throughput terminal workflows? Explore our guide on [Configuring Claude Code with Custom Base URLs](/blog/how-to-set-up-claude-code-cli-with-custom-base-url/), examine custom key savings in our [Cursor Pro vs. Custom API Key Benchmark](/blog/cursor-pro-vs-custom-api-key/), connect frontier coding models via [Ox Alpha in Claude Code & Cursor](/blog/ox-alpha-claude-code-cursor-setup/), or optimize token budgets with our [OpenCode PayPal Billing & Proxy Guide](/blog/opencode-paypal-billing-api-proxy-guide/).
  </p>
</div>

Executing an **OmniRoute setup with Claude Code** (commonly searched as `omniroute setup claude code`) allows developers to bypass Anthropic's rigid 5-hour rate limits and abrupt `429 Too Many Requests` quota blocks. The open-source project **OmniRoute** (`diegosouzapw/OmniRoute`) aggregates free provider tiers and routes LLM calls through a local OpenAI-compatible daemon on `localhost:20128`.

However, self-hosting an AI proxy introduces operational friction: keeping background daemons active, managing unstable free-tier tokens, and safeguarding local network ports. 

Before configuring your local router, test your connectivity against an unthrottled endpoint:

```bash
# Verify active connectivity to an unthrottled Claude-compatible gateway
curl -X POST https://api.apivale.com/v1/chat/completions \
  -H "Authorization: Bearer your_apivale_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5",
    "messages": [{"role": "user", "content": "Verify gateway connection."}],
    "max_tokens": 16
  }'
```

<div class="my-6 border-l-4 border-amber-500 bg-gray-900 rounded-r-lg p-5">
  <div class="flex items-center gap-2">
    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Verified Community Voice</span>
    <span class="text-xs text-gray-400 font-mono">GitHub Issues & Developer Discussions</span>
  </div>
  <blockquote class="mt-2 text-sm italic text-gray-300">
    "OmniRoute cascading saved my Claude Code session when Anthropic rate-limited my primary account mid-refactor. But having to babysit three separate provider free-tier tokens and debug node-gyp build failures on Windows makes me question whether maintaining my own local proxy is worth the engineering hours."
  </blockquote>
  <div class="mt-2 text-xs text-gray-400 font-mono">
    — Verified Engineer Feedback via <a href="https://github.com/diegosouzapw/OmniRoute" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline">GitHub diegosouzapw/OmniRoute Community</a>
  </div>
</div>

<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <div class="mt-1 text-md font-semibold text-white">OmniRoute Self-Hosted Gateway</div>
  <p class="mt-2 text-sm text-gray-300">OmniRoute is an open-source, MIT-licensed local proxy server that intercepts, compresses, and routes AI requests across multiple third-party model providers using a single OpenAI-compatible base URL.</p>
</div>

---

## 1. Three-Step OmniRoute Installation via npm and Docker

Deploy OmniRoute locally using Node.js or an isolated Docker container to expose port 20128.

```mermaid
graph TD
    A["Developer Terminal / Claude Code CLI"] -->|HTTP localhost:20128| B["OmniRoute Local Proxy"]
    B -->|RTK / Caveman Compression| C{"Quota Check & Health Probe"}
    C -->|Healthy| D["Primary Free/Paid Provider"]
    C -->|Rate Limited 429| E["Cascading Fallback Provider"]
    C -->|All Local Tiers Fail| F["APIVALE Enterprise Cloud Gateway"]
```

### Step 1: Deploying the Local Gateway via npm or Docker Container

Launch OmniRoute using your preferred runtime environment:

```bash
# Option A: Quick-launch via npm (requires Node.js 18+)
npx omniroute start --port 20128

# Option B: Run in detached Docker container with volume persistence
docker run -d \
  --name omniroute-gateway \
  -p 127.0.0.1:20128:20128 \
  -v ~/.omniroute:/root/.omniroute \
  --restart unless-stopped \
  diegosouzapw/omniroute:latest
```

### Step 2: Validating Port 20128 and Keyring Storage

Verify that the local routing daemon is responding before pointing terminal tools toward it:

```bash
# Health check request to verify local daemon readiness
curl -s http://localhost:20128/health || echo "OmniRoute daemon offline. Check Docker logs."
```

When the endpoint returns `{"status":"ok"}`, the proxy is ready to accept provider credentials.

---

## 2. OmniRoute Setup with Claude Code: Step-by-Step Terminal Integration

Completing an **OmniRoute setup with Claude Code** CLI requires configuring custom Anthropic environment variables and establishing per-model routing profiles.

### Configuring CLI Launch Flags and Environment Base URLs

Claude Code natively respects the `ANTHROPIC_BASE_URL` override flag. Pass your local proxy URL directly into your active shell session:

```bash
# Direct Claude Code CLI to the local OmniRoute proxy daemon
export ANTHROPIC_BASE_URL="http://localhost:20128/v1"
export ANTHROPIC_AUTH_TOKEN="omniroute-local-bypass-key"
export ANTHROPIC_MODEL="claude-sonnet-5"

# Launch Claude Code within your repository
npx @anthropic-ai/claude-code
```

### Defining Per-Model Routing Profiles and Fallback Cascades

Create a custom YAML routing profile at `~/.omniroute/config.yaml` to specify fallback rules when Claude Sonnet encounters rate limits:

```yaml
# OmniRoute multi-provider cascading fallback configuration
version: "2.0"
server:
  host: "127.0.0.1"
  port: 20128
  timeout_ms: 45000

compression:
  rtk_strip_terminal_noise: true
  caveman_linguistic_ratio: 0.85

routes:
  - alias: "claude-sonnet-5"
    strategy: "failover"
    targets:
      - provider: "anthropic-direct"
        model: "claude-3-5-sonnet-20241022"
        priority: 1
      - provider: "apivale-cloud"
        endpoint: "https://api.apivale.com/v1"
        model: "claude-sonnet-5"
        api_key: "${APIVALE_API_KEY}"
        priority: 2
```

With this cascading configuration, if your primary direct key triggers a 429 status code, OmniRoute immediately routes the prompt to your APIVALE cloud fallback without crashing the active Claude Code REPL session.

---

## 3. OmniRoute Self-Hosted Gateway vs. Managed Cloud API Router

Evaluate whether maintaining local proxy daemons aligns with your team's velocity compared to utilizing an enterprise cloud gateway.

| Operational Dimension | OmniRoute (Self-Hosted Proxy) | APIVALE (Managed Cloud Gateway) | Best For... |
| :--- | :--- | :--- | :--- |
| **Hosting Model** | Local workstation / Docker daemon | Distributed global edge infrastructure | **APIVALE** for zero DevOps overhead |
| **Setup Time** | 10–25 minutes (Node/Docker, YAML configs) | 30 seconds (1-line environment variable) | **APIVALE** for instant terminal onboarding |
| **Rate Limit Handling** | Manual provider pooling & key rotation | Unthrottled shared concurrency pools | **APIVALE** for uninterrupted refactoring |
| **Token Optimization** | Built-in RTK + Caveman local heuristics | Enterprise prompt caching & lossless deduplication | **OmniRoute** for aggressive terminal stripping |
| **Security Surface** | Local port exposure & plaintext key files | Encrypted vault, TLS 1.3, zero local storage | **APIVALE** for enterprise compliance |
| **Payment Options** | Fragmented accounts per provider | **PayPal Instant Checkout**, Global Cards, Alipay | **APIVALE** for frictionless global billing |
| **KYC & Identity** | Dependent on individual free tiers | Zero KYC, no domestic phone required | **APIVALE** for international developers |

*Note: Technical features and architectural parameters verified via official documentation as of September 2026.*

### Looking for "OmniRoute Online"? Why Cloud Routers Eliminate DevOps Overhead

Developers searching for "OmniRoute online" or hosted cloud alternatives are typically seeking the multi-model flexibility of an AI gateway without the burden of running Node.js processes, configuring port forwarding, or handling local process crashes. Teams evaluating cloud routers often compare hosted setups with [established OpenRouter alternatives](/blog/openrouter-alternatives/) to ensure high-concurrency uptime.

When you run OmniRoute locally:
1. Your laptop must remain awake; sleep mode severs long-running agent loops.
2. Provider quotas expire unpredictably, causing sudden mid-generation breaks.
3. Free-tier aggregators often inject proprietary throttling or silently degrade response quality.

Using **APIVALE** provides a fully managed, high-concurrency cloud endpoint (`https://api.apivale.com/v1`) that requires no local daemon. You get direct access to **Claude Sonnet 5**, **DeepSeek V4**, and **Qwen 3.7 Max** with official PayPal checkout and zero identity verification.

### Token Compression: Trade-Offs of RTK and Caveman on Code Refactoring Accuracy

OmniRoute features two notable compression pipelines: **RTK (Rust Token Killer)**, which prunes terminal build logs and stack traces, and **Caveman**, which applies linguistic reduction to natural language system prompts. Developers interested in minimizing context bloat without lossy prose degradation should also review our benchmarks on [reducing LLM API terminal noise and tool output expenses](/blog/reduce-llm-api-costs-terminal-noise/).

While stripping 50,000 tokens of package manager output saves substantial cost, aggressive prose compression can strip nuanced architectural constraints from coding agent instructions. For production repositories, use lossless prompt caching at the gateway layer rather than lossy semantic pruning.

---

## 4. Security Architecture & CVE Considerations for Self-Hosted Gateways

Deploying local network proxies requires strict adherence to security best practices to protect sensitive API keys and internal source code.

```mermaid
sequenceDiagram
    autonumber
    participant CLI as Claude Code CLI
    participant Proxy as Local OmniRoute (127.0.0.1)
    participant Cloud as APIVALE Managed Gateway
    participant LLM as Frontier Model Cluster

    CLI->>Proxy: POST /v1/messages (Payload + Context)
    alt Local Provider Healthy
        Proxy->>LLM: Forward Request (Local Key)
        LLM-->>Proxy: 200 OK (Stream Chunks)
        Proxy-->>CLI: Return Response
    else Upstream Rate Limited (HTTP 429)
        Proxy->>Cloud: Failover to APIVALE (Encrypted TLS)
        Cloud->>LLM: Unthrottled Enterprise Pool
        LLM-->>Cloud: 200 OK
        Cloud-->>Proxy: Return Stream
        Proxy-->>CLI: Transparent Output (Zero Agent Drop)
    end
```

### Network Exposure, CORS, and Local Secret Management

When running OmniRoute or similar local proxy tools:
* **Never bind to `0.0.0.0`:** Binding to all network interfaces exposes your local AI proxy to any machine on the same Wi-Fi network. Always restrict the host listener strictly to `127.0.0.1`.
* **Protect local config files:** Storing dozens of provider API keys in plaintext `~/.omniroute/config.yaml` files poses credential leakage risks if malicious dependencies read user home directories.
* **CORS and localhost SSRF:** Ensure browser-based tools cannot make unauthenticated cross-origin requests to `http://localhost:20128` to extract stored provider tokens.

### High-Concurrency Failover and Guaranteed Uptime SLAs

For mission-critical production coding, local proxies cannot match the reliability of multi-region cloud routing. If your machine experiences CPU throttling or network jitter, local proxy buffers can drop Server-Sent Events (SSE) packets, causing Claude Code to hang. 

Integrating APIVALE as your primary endpoint or secondary failover target ensures enterprise 99.99% availability backed by automated multi-cluster redundancy.

---

## Production-Grade Claude Code Router with Automatic Failover

Implement this Node.js configuration script (`claude-router.js`) featuring health probing and automatic failover from local OmniRoute to APIVALE:

```javascript
// Production Claude Code Proxy Relay with Local-to-Cloud Failover
import http from 'http';
import https from 'https';

const LOCAL_GATEWAY = { host: '127.0.0.1', port: 20128, path: '/v1/chat/completions' };
const CLOUD_GATEWAY = { host: 'api.apivale.com', port: 443, path: '/v1/chat/completions' };
const APIVALE_KEY = process.env.APIVALE_API_KEY || 'your_apivale_key_here';

const server = http.createServer(async (req, res) => {
  let bodyChunks = [];
  req.on('data', chunk => bodyChunks.push(chunk));
  req.on('end', async () => {
    const rawPayload = Buffer.concat(bodyChunks);

    try {
      await forwardRequest(LOCAL_GATEWAY, rawPayload, req.headers, res, false);
    } catch (localErr) {
      console.warn(`[Failover] Local OmniRoute offline: ${localErr.message}. Cascading to APIVALE...`);
      const cloudHeaders = { ...req.headers, 'authorization': `Bearer ${APIVALE_KEY}`, 'host': 'api.apivale.com' };
      await forwardRequest(CLOUD_GATEWAY, rawPayload, cloudHeaders, res, true);
    }
  });
});

function forwardRequest(target, payload, headers, clientRes, isHttps) {
  return new Promise((resolve, reject) => {
    const transport = isHttps ? https : http;
    const proxyReq = transport.request({
      hostname: target.host, port: target.port, path: target.path,
      method: 'POST', headers: { ...headers, 'content-length': payload.length }, timeout: 10000
    }, (proxyRes) => {
      if (proxyRes.statusCode >= 500 || proxyRes.statusCode === 429) {
        return reject(new Error(`Upstream returned status ${proxyRes.statusCode}`));
      }
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', reject);
    proxyReq.write(payload);
    proxyReq.end();
  });
}

server.listen(8080, '127.0.0.1', () => {
  console.log('Production Claude Code Failover Relay active on http://127.0.0.1:8080');
});
```

---

<!-- Interactive In-Article Playground Micro-Tool -->
<div class="my-8 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-gray-900 via-indigo-950/20 to-gray-900 p-6 shadow-2xl">
  <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
    <div class="text-base font-bold text-white flex items-center gap-2">
      <span>⚡ Live Configuration Generator: OmniRoute vs. APIVALE Cloud</span>
    </div>
    <span class="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
      Zero Registration Tester
    </span>
  </div>
  <p class="text-sm text-gray-300 mb-5">
    Select your deployment preference to generate verified terminal setup commands for Claude Code CLI or Cursor:
  </p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div>
      <label for="gateway-mode-select" class="block text-xs font-medium text-gray-400 mb-1">Gateway Architecture</label>
      <select id="gateway-mode-select" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
        <option value="cloud">APIVALE Managed Cloud (Recommended)</option>
        <option value="local">OmniRoute Local Proxy (localhost:20128)</option>
      </select>
    </div>
    <div>
      <label for="agent-client-select" class="block text-xs font-medium text-gray-400 mb-1">Target Coding Agent</label>
      <select id="agent-client-select" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
        <option value="claude-code">Claude Code CLI</option>
        <option value="cursor">Cursor IDE (.cursorrules)</option>
        <option value="cline">Cline / VS Code Extension</option>
      </select>
    </div>
    <div>
      <label for="target-model-select" class="block text-xs font-medium text-gray-400 mb-1">Target Model Engine</label>
      <select id="target-model-select" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
        <option value="claude-sonnet-5">Claude Sonnet 5</option>
        <option value="deepseek-v4">DeepSeek V4</option>
        <option value="qwen3.7-max">Qwen 3.7 Max</option>
      </select>
    </div>
  </div>

  <div class="relative mt-4">
    <pre id="generated-cli-command" class="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs font-mono text-cyan-300 overflow-x-auto">export ANTHROPIC_BASE_URL="https://api.apivale.com/v1"
export ANTHROPIC_AUTH_TOKEN="your_apivale_key_here"
export ANTHROPIC_MODEL="claude-sonnet-5"
npx @anthropic-ai/claude-code</pre>
  </div>
</div>

<script>
  (function initPlayground() {
    const modeSelect = document.getElementById('gateway-mode-select');
    const agentSelect = document.getElementById('agent-client-select');
    const modelSelect = document.getElementById('target-model-select');
    const outputBox = document.getElementById('generated-cli-command');

    function updateCommand() {
      if (!modeSelect || !agentSelect || !modelSelect || !outputBox) return;
      const mode = modeSelect.value;
      const agent = agentSelect.value;
      const model = modelSelect.value;

      const baseUrl = mode === 'cloud' ? 'https://api.apivale.com/v1' : 'http://localhost:20128/v1';
      const keyVal = mode === 'cloud' ? 'your_apivale_key_here' : 'omniroute_local_key';

      if (agent === 'claude-code') {
        outputBox.textContent = 'export ANTHROPIC_BASE_URL="' + baseUrl + '"\nexport ANTHROPIC_AUTH_TOKEN="' + keyVal + '"\nexport ANTHROPIC_MODEL="' + model + '"\nnpx @anthropic-ai/claude-code';
      } else if (agent === 'cursor') {
        outputBox.textContent = '// Cursor Settings > Models > OpenAI Base URL:\n' + baseUrl + '\n// API Key:\n' + keyVal + '\n// Model Name:\n' + model;
      } else {
        outputBox.textContent = '{\n  "apiProvider": "openai-compatible",\n  "baseUrl": "' + baseUrl + '",\n  "apiKey": "' + keyVal + '",\n  "modelId": "' + model + '"\n}';
      }
    }

    if (modeSelect && agentSelect && modelSelect) {
      modeSelect.addEventListener('change', updateCommand);
      agentSelect.addEventListener('change', updateCommand);
      modelSelect.addEventListener('change', updateCommand);
    }
  })();
</script>

---

## Frequently Asked Questions (FAQ)

### How do I complete an OmniRoute setup with Claude Code?
Install OmniRoute via `npx omniroute start --port 20128` or Docker. Then, configure your terminal environment variables by setting `export ANTHROPIC_BASE_URL="http://localhost:20128/v1"` and `export ANTHROPIC_AUTH_TOKEN="your_key"` before executing `npx @anthropic-ai/claude-code`.

### How to connect OmniRoute to Claude Code?
Connect OmniRoute by redirecting Claude Code's Anthropic base URL to your local loopback address (`http://127.0.0.1:20128/v1`). If you require zero-setup cloud routing without keeping a local Node process running, route directly to `https://api.apivale.com/v1` with your APIVALE API key.

### Is running a local self-hosted AI gateway like OmniRoute secure?
Running OmniRoute locally is secure if strictly bound to loopback interface `127.0.0.1`. Binding to `0.0.0.0` or running unverified npm packages exposes local API keys to local network snooping. For production team collaboration, managed API gateways with encrypted key vaults and automated IP access controls provide superior isolation.

### How do I access Claude Sonnet 5 and DeepSeek V4 without managing local Docker containers?
Access both frontier models directly through the APIVALE unified cloud gateway (`https://api.apivale.com/v1`). APIVALE supports PayPal official instant checkout, international credit cards, Apple Pay, and Alipay with zero KYC and no domestic phone verification.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I complete an OmniRoute setup with Claude Code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Install OmniRoute via npx omniroute start --port 20128 or Docker. Then configure your terminal with ANTHROPIC_BASE_URL='http://localhost:20128/v1' and launch Claude Code CLI."
      }
    },
    {
      "@type": "Question",
      "name": "How to connect OmniRoute to Claude Code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Set ANTHROPIC_BASE_URL to http://127.0.0.1:20128/v1 in your shell. For a zero-maintenance cloud solution, set ANTHROPIC_BASE_URL to https://api.apivale.com/v1 with an APIVALE token."
      }
    },
    {
      "@type": "Question",
      "name": "Is running a local self-hosted AI gateway like OmniRoute secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is secure when bound strictly to 127.0.0.1. Binding to 0.0.0.0 exposes local API keys and unencrypted proxy payloads to other machines on your local network."
      }
    },
    {
      "@type": "Question",
      "name": "How do I access Claude Sonnet 5 and DeepSeek V4 without managing local Docker containers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Route through APIVALE's enterprise cloud gateway (https://api.apivale.com/v1). APIVALE supports PayPal official instant checkout, credit cards, and Alipay with zero KYC and unthrottled high concurrency."
      }
    }
  ]
}
</script>

---

<!-- Ending Wallet-Aligned CTA Card -->
<div class="cta-card my-10 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-gray-900 via-gray-900/90 to-emerald-950/30 p-8 shadow-2xl text-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 uppercase tracking-wider">
    🚀 Enterprise Gateway Privilege
  </div>
  <div class="text-2xl md:text-3xl font-bold text-white mb-3">
    Tired of Managing Local AI Gateways and Rate Limits?
  </div>
  <p class="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
    Route your <strong>Claude Code CLI</strong>, <strong>Cursor</strong>, and <strong>Cline</strong> workflows through APIVALE's high-speed cloud endpoint. Enjoy seamless PayPal checkout, zero identity verification, and unthrottled access to Claude Sonnet 5, DeepSeek V4, and Qwen 3.7 Max.
  </p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
    <div class="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4">
      <div class="text-xs text-emerald-400 font-semibold uppercase">First Deposit Privilege</div>
      <div class="text-lg font-bold text-white mt-1">+50% Bonus Compute</div>
      <div class="text-xs text-gray-400 mt-1">Deposit $5 get $7.50, or deposit $29 get $43.50 instantly.</div>
    </div>
    <div class="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4">
      <div class="text-xs text-cyan-400 font-semibold uppercase">Developer Pack</div>
      <div class="text-lg font-bold text-white mt-1">$29 Special Tier</div>
      <div class="text-xs text-gray-400 mt-1">40M Tokens (56% OFF). Never expires, zero monthly subscription.</div>
    </div>
    <div class="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4">
      <div class="text-xs text-purple-400 font-semibold uppercase">Zero-Risk Sandbox</div>
      <div class="text-lg font-bold text-white mt-1">$0.20 Free Credit</div>
      <div class="text-xs text-gray-400 mt-1">Instant signup credit. No credit card or phone required.</div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <a href="https://apivale.com/sign-up?redirect=/blog/omniroute-claude-code-setup/" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25">
      Claim $0.20 Free Credit & Get API Key &rarr;
    </a>
    <a href="https://apivale.com/pricing?redirect=/blog/omniroute-claude-code-setup/" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm border border-gray-700 transition-all">
      View Pricing & Token Rates
    </a>
  </div>
</div>
