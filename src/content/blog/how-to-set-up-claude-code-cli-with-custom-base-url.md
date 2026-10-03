---
title: "How to Set Up Claude Code Custom Base URL (ANTHROPIC_BASE_URL Setup)"
metaTitle: "Claude Code Base URL [Fix 403 Error Setup] | APIVALE"
description: "Learn how to configure ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN for Claude Code CLI. Fix 403 errors, bypass rate limits, and route to APIVALE with PayPal."
date: "2026-07-11"
author: "Alex Rivera"
authorTitle: "Senior Cloud Architect & API Integrations, APIVALE"
authorBio: "Alex Rivera is a cloud architect specializing in high-concurrency routing, API gateway latency optimization, and developer proxy tools."
tags: ["Claude Code", "anthropic_base_url", "API Proxy", "Claude Code Router", "Cost Optimization", "PayPal"]
image: "/blog/how-to-set-up-claude-code-cli-with-custom-base-url.png"
lang: "en"
---

Anthropic's new **Claude Code CLI** brings an agentic coding assistant directly into your terminal. However, running Claude Code on large codebases triggers an enormous volume of input tokens because the CLI repeatedly scans your workspace. This developer workflow quickly runs into official API rate limits (TPM/RPM quotas) and can result in massive, unexpected monthly bills.

For developers outside official billing regions, or teams seeking to optimize costs and bypass rate-limiting bottlenecks, redirecting the CLI using a custom endpoint is the ultimate workaround. If you are comparing local proxy daemons with cloud gateways, review our guide on [configuring OmniRoute with Claude Code](/blog/omniroute-claude-code-setup/). You can also route terminal agents directly to frontier models like [Claude Fable 5.1 (with 85% hybrid cost savings)](/blog/claude-fable-5-1-price-claude-code-guide/), [Claude Opus 5](/blog/how-to-connect-claude-opus-5-to-claude-code-cli/), [Qwen 3.8-Max](/blog/how-to-connect-qwen-3-8-to-claude-code-cli/), or [Qwen 3.7-Max](/blog/how-to-connect-qwen-3-7-to-claude-code-cli/).

In this guide, we show you how to configure Claude Code to use a custom proxy gateway by setting the `anthropic_base_url` and `anthropic_auth_token` variables, and how to build a custom `claude-code-router` to dynamically balance and audit requests.

### Quick Start: Launch Claude Code with a Custom Endpoint

To bypass official billing barriers, set your terminal environment variables to point directly to the APIVALE global proxy endpoint before starting the CLI:

```bash
# Set your APIVALE credentials and launch the CLI
export ANTHROPIC_BASE_URL="https://apivale.com/v1"
export ANTHROPIC_AUTH_TOKEN="your_apivale_key_here"
npx @anthropic-ai/claude-code
```

---

## Official Anthropic Endpoint vs. APIVALE Proxy Gateway

Before routing your terminal agent through a proxy, it is important to compare the onboarding requirements, pricing, and concurrency levels:

| Parameter / Feature | Official Anthropic API | APIVALE Gateway Proxy |
| :--- | :--- | :--- |
| **Required Env Vars** | `ANTHROPIC_API_KEY` | `ANTHROPIC_BASE_URL` & `ANTHROPIC_AUTH_TOKEN` |
| **Authentication** | Official Developer Console Account | APIVALE API Key (GitHub 1-Click Login) |
| **Billing & KYC** | Biometric verification / Regional credit card | **PayPal Global Billing** / Credit Cards via PayPal |
| **Claude 3.5 Sonnet Rate Limits** | Dynamic tiering (e.g., 40,000 TPM limit on Tier 1) | Shared high-concurrency pool (up to 500 RPM / 400k TPM) |
| **Pricing (per 1M Tokens)** | $3.00 Input / $15.00 Output | $3.00 Input / $15.00 Output (No proxy markup) |
| **Smart Caching** | Supported (30-min minimum) | Supported (90% discount on cache hits) |

---

<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">Claude Code Custom Router</h4>
  <p class="mt-2 text-sm text-gray-300">A Claude Code Custom Router is a proxy configuration layer that intercepts network requests originating from the Claude Code CLI and redirects them from api.anthropic.com to an alternative endpoint (such as api.apivale.com/v1) using the anthropic_base_url and anthropic_auth_token environment variables.</p>
</div>

---

## Why Developers Need a Custom Base URL for Claude Code

When Claude Code operates in a codebase, it performs multi-step task planning. It reads files, writes code edits, runs tests, and queries shell commands. Each loop submits the updated codebase history back to the model. 

This results in two major bottlenecks for active developers:
1. **The Rate Limit Wall**: Under official Tier 1/2 developer accounts, running Claude Code on a mid-sized React or Python project can hit the Token Per Minute (TPM) limit in just 3 or 4 terminal prompts, causing the agent to crash with `429 Too Many Requests`.
2. **Billing and Geographical Access**: Developers in non-supported regions are unable to pay for official API keys, forcing them to rely on third-party aggregators that accept global payment methods like PayPal.

By redirecting the CLI requests using `export ANTHROPIC_BASE_URL="https://api.apivale.com/v1"`, you connect to APIVALE's enterprise-grade endpoint pools, which bypass individual rate limits and route requests through high-bandwidth channels.

---

## Technical Integration: Configuring Your Environment

Depending on your operating system, choose one of the following methods to establish the custom endpoint.

### macOS & Linux Setup
Add the variables to your shell profile (e.g., `~/.zshrc` or `~/.bashrc`) to make the setup permanent:

```bash
# Open profile editor
nano ~/.zshrc

# Append the custom gateway settings
export ANTHROPIC_BASE_URL="https://api.apivale.com/v1"
export ANTHROPIC_AUTH_TOKEN="apivale-key-xxxxxxxxxx"

# Apply changes and start Claude Code
source ~/.zshrc
npx @anthropic-ai/claude-code
```

### Windows PowerShell Setup
For Windows users, configure your environmental variables in the active PowerShell window:

```powershell
# Set variables in current shell session
$env:ANTHROPIC_BASE_URL="https://api.apivale.com/v1"
$env:ANTHROPIC_AUTH_TOKEN="apivale-key-xxxxxxxxxx"

# Run Claude Code
npx @anthropic-ai/claude-code
```

> **Tip for Windows Developers**: If you want real-time menu bar quota telemetry or need to run status checks on Windows 10/11, check our step-by-step [CodexBar on Windows & WSL2 Setup Guide](/blog/how-to-connect-claude-opus-5-to-claude-code-cli/).

---

## Advanced: Building a Local Claude Code Router

For teams that want to log prompts, track token consumption, or dynamically swap endpoints to optimize costs, you can run a local proxy router. 

Below are two production-ready scripts to set up a local `claude-code-router` that intercept terminal agent requests, logs the token telemetry, and routes them to APIVALE.

### TypeScript / Node.js Router Script

Create a file named `router.ts` and install `express` and `axios`:

```typescript
import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const TARGET_GATEWAY = 'https://api.apivale.com/v1';

app.use(express.json());

// Log incoming Claude Code agent requests and route them to APIVALE
app.post('/v1/messages', async (req: Request, res: Response): Promise<void> => {
  const authToken = req.headers['x-api-key'] || req.headers['authorization'];
  
  console.log(`[Claude Code Agent] Model Requested: ${req.body.model}`);
  console.log(`[Claude Code Agent] Input Tokens (Approx): ${JSON.stringify(req.body.messages).length / 4}`);

  try {
    const response = await axios.post(`${TARGET_GATEWAY}/messages`, req.body, {
      headers: {
        'x-api-key': authToken,
        'content-type': 'application/json',
      },
      responseType: req.body.stream ? 'stream' : 'json'
    });

    if (req.body.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      response.data.pipe(res);
    } else {
      res.json(response.data);
    }
  } catch (error: any) {
    console.error(`[Error] Routing failed: ${error.message}`);
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { error: 'Router Connection Refused' };
    res.status(status).json(errorData);
  }
});

app.listen(PORT, () => {
  console.log(`Claude Code Router is running locally on http://localhost:${PORT}`);
});
```

### Python Router Script

Alternatively, you can run a fast Python proxy using `Flask`:

```python
import os
import requests
from flask import Flask, request, Response, stream_with_context

app = Flask(__name__)
PORT = 3000
TARGET_GATEWAY = "https://api.apivale.com/v1"

@app.route("/v1/messages", methods=["POST"])
def route_claude_messages():
    auth_key = request.headers.get("x-api-key") or request.headers.get("Authorization")
    if not auth_key:
        return {"error": "Missing authorization token"}, 401
        
    payload = request.json
    print(f"[Python Router] Intercepted prompt for model: {payload.get('model')}")
    
    headers = {
        "x-api-key": auth_key,
        "content-type": "application/json"
    }
    
    try:
        # Route to APIVALE
        upstream_res = requests.post(
            f"{TARGET_GATEWAY}/messages",
            json=payload,
            headers=headers,
            stream=payload.get("stream", False)
        )
        
        if payload.get("stream", False):
            def generate():
                for chunk in upstream_res.iter_content(chunk_size=1024):
                    yield chunk
            return Response(stream_with_context(generate()), content_type="text/event-stream")
        else:
            return Response(upstream_res.content, status=upstream_res.status_code, content_type="application/json")
            
    except requests.exceptions.RequestException as e:
        print(f"[Router Exception] Connection failed: {e}")
        return {"error": "Gateway connection timed out"}, 504

if __name__ == "__main__":
    app.run(port=PORT)
```

To use this local router, point your environment variables to your local machine:
```bash
export ANTHROPIC_BASE_URL="http://localhost:3000/v1"
export ANTHROPIC_AUTH_TOKEN="your_apivale_key_here"
npx @anthropic-ai/claude-code
```

---

<div class="cta-card">
  <h4 class="cta-card-title">⚡ Power Up Claude Code on APIVALE</h4>
  <p class="cta-card-text">Ditch regional billing limits and low-concurrency API tiers. Use APIVALE to route your Claude Code terminal agents, Cursor editor configurations, or backend services through our high-performance global network. Optimize your spending with 90% prompt caching discounts and built-in PayPal billing support. Create an account today and claim $0.20 free starter credit (+ 50% bonus on 1st top-up).</p>
  <div class="cta-card-actions">
    <a href="https://apivale.com/sign-up?utm_source=apivale_blog&utm_medium=blog&utm_campaign=how-to-set-up-claude-code-cli-with-custom-base-url" class="cta-primary-btn">Get Free API Key Now</a>
    <a href="https://apivale.com/api/?utm_source=apivale_blog&utm_medium=blog&utm_campaign=how-to-set-up-claude-code-cli-with-custom-base-url" class="cta-secondary-btn">Check Pricing Plans</a>
  </div>
</div>

---

## Developer FAQ

**Q: Can I use anthropic_base_url with the Claude Code CLI?**  
**A:** Yes. The official Claude Code CLI respects standard Anthropic SDK environment variables. Setting `anthropic_base_url` routes all network commands to your custom server instead of Anthropic's default API servers.

**Q: How do I configure anthropic_auth_token if the CLI asks for an OAuth login?**  
**A:** If you set both `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` in your environment, the CLI bypasses the interactive browser login completely and authenticates using your specified token.

**Q: Will prompt caching work when using a custom base URL?**  
**A:** Yes. APIVALE fully supports prompt caching headers. When Claude Code requests caching, our network caches the system prompt block and passes the 90% discount directly back to your APIVALE billing balance.

**Q: What should I do if my local router returns a 401 authentication error?**  
**A:** A 401 error means your authentication key is missing or invalid. Check that your APIVALE key is correctly loaded into the `ANTHROPIC_AUTH_TOKEN` variable and that your local router forwards the header correctly.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I use anthropic_base_url with the Claude Code CLI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The official Claude Code CLI respects standard Anthropic SDK environment variables. Setting anthropic_base_url routes all network commands to your custom server instead of Anthropic's default API servers."
      }
    },
    {
      "@type": "Question",
      "name": "How do I configure anthropic_auth_token if the CLI asks for an OAuth login?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If you set both ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN in your environment, the CLI bypasses the interactive browser login completely and authenticates using your specified token."
      }
    },
    {
      "@type": "Question",
      "name": "Will prompt caching work when using a custom base URL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. APIVALE fully supports prompt caching headers. When Claude Code requests caching, our network caches the system prompt block and passes the 90% discount directly back to your APIVALE billing balance."
      }
    },
    {
      "@type": "Question",
      "name": "What should I do if my local router returns a 401 authentication error?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A 401 error means your authentication key is missing or invalid. Check that your APIVALE key is correctly loaded into the ANTHROPIC_AUTH_TOKEN variable and that your local router forwards the header correctly."
      }
    }
  ]
}
</script>
