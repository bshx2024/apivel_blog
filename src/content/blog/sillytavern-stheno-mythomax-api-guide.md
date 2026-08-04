---
title: "SillyTavern Setup: Access Stheno v3.2 & MythoMax APIs via APIVALE"
metaTitle: "SillyTavern Setup: Access Stheno & MythoMax API | APIVALE"
description: "Configure SillyTavern for low-latency character roleplay using Stheno v3.2 and MythoMax APIs. Route requests with APIVALE global proxy gateway."
date: "2026-07-12"
author: "Kenji Tanaka"
authorTitle: "AI Developer Relations Engineer, APIVALE"
authorBio: "Kenji Tanaka is an AI Developer Relations Engineer specializing in multimodal API integrations, local LLM orchestration, and front-end interface customization."
tags: ["SillyTavern", "Stheno v3.2", "MythoMax", "Roleplay Models", "APIVALE", "Uncensored API"]
image: "/blog/sillytavern-stheno-mythomax-api-guide.png"
lang: "en"
---

Mainstream large language models (like GPT-4o or Claude 3.5 Sonnet) are subject to strict, generalized safety alignment policies. These restrictions frequently trigger false positives, leading to frustrating refusals during creative writing, fantasy roleplay, interactive gaming, or immersive storytelling. While local hosting of open-source models offers a bypass, running 8B or 13B models requires expensive consumer GPUs and drains battery life rapidly on mobile devices.

For writers, creators, and game developers seeking unrestricted, highly expressive roleplay without hardware limitations, connecting **SillyTavern** to high-performance open-source models via a cloud gateway is the ideal solution.

In this guide, we show you how to configure SillyTavern to utilize **Stheno v3.2** and **MythoMax L2 13B** via the **APIVALE** global proxy gateway—bypassing geographical restrictions, identity verification, and hardware bottlenecks.

### Quick Start: Call Stheno v3.2 with cURL

Validate your APIVALE connection by running this simple cURL command in your terminal to request a response from the Stheno v3.2 model:

```bash
curl https://api.apivale.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_apivale_key_here" \
  -d '{
    "model": "sao10k/l3-stheno-8b",
    "messages": [
      {"role": "system", "content": "You are a fantasy merchant selling mysterious potions."},
      {"role": "user", "content": "Greetings, what do you have in stock?"}
    ],
    "temperature": 0.9
  }'
```

---

## Roleplay Models: APIVALE Gateway vs. Aligned Baselines

When developing creative interfaces or configuring personal roleplay backends, choosing the right model balance between context length, pricing, and alignment is critical:

| Model Identifier | Context Window | Price (per 1M Input Tokens) | Price (per 1M Output Tokens) | Censorship & Alignment | Primary Roleplay Strength |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **`sao10k/l3-stheno-8b`** | 8,192 | $0.15 | $0.15 | Uncensored (No Refusals) | High formatting speed, rich character voice |
| **`gryphe/mythomax-l2-13b`** | 4,096 | $0.20 | $0.20 | Uncensored (No Refusals) | Classic fantasy writing style, logical narrative |
| **`openai/gpt-4o`** | 128,000 | $2.50 | $10.00 | Highly Censored | Coding, analytical logic, dry writing style |

---

<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">SillyTavern API Bridge</h4>
  <p class="mt-2 text-sm text-gray-300">A SillyTavern API Bridge is a configuration architecture that intercepts chat interface requests from the SillyTavern frontend and relays them to an OpenAI-compatible proxy gateway (such as api.apivale.com/v1) using unified developer keys to access specialized, uncensored open-source models.</p>
</div>

---

## Step-by-Step SillyTavern UI Configuration

Follow these steps to connect your local or mobile SillyTavern installation to APIVALE:

1. **Access API Settings**: Launch SillyTavern on your desktop or mobile device. Click the **Plug Icon** (API Connections) in the top-right navigation bar.
2. **Select API Type**: In the "API" dropdown menu, select **OpenAI**. (Note: Do not select KoboldAI or Horde; APIVALE exposes these models through a standard OpenAI-compatible API endpoint).
3. **Configure the Endpoint URL**: Uncheck the "Use Reverse Proxy" box if it is checked. In the **API URL** input box, paste the APIVALE gateway endpoint:
   ```text
   https://api.apivale.com/v1
   ```
4. **Input the Authentication Token**: Paste your unique APIVALE API key (available in your APIVALE dashboard) into the **API Key** input box.
5. **Establish Connection**: Click the **Connect** button. SillyTavern will send a handshake request. Once successful, the status indicator will turn green, and the **Model** dropdown list will populate.
6. **Choose Your Model**: Under the Model dropdown, select either `sao10k/l3-stheno-8b` (recommended for fast, descriptive mobile chat) or `gryphe/mythomax-l2-13b` (recommended for long-form narrative consistency).

> [!TIP]
> **Optimize Mobile Latency**: If you are using SillyTavern Mobile (via Termux or a hosted server), check the **Streaming** checkbox in the API settings. Streaming sends tokens to your screen as they are generated, reducing the Time-to-First-Token (TTFT) to less than 150ms.

---

## Programmatic Integration: Python and TypeScript SDKs

For developers building custom frontends or automating interactive NPCs, here is how to call these roleplay models using standard SDKs.

### Python SDK Integration

Install the official package:
```bash
pip install openai
```

Implement the client with robust exception handling:

```python
import os
from openai import OpenAI, AuthenticationError, RateLimitError, APIError

# Initialize client pointing to APIVALE proxy
client = OpenAI(
    api_key="your_apivale_key_here",
    base_url="https://api.apivale.com/v1"
)

try:
    response = client.chat.completions.create(
        model="sao10k/l3-stheno-8b",
        messages=[
            {"role": "system", "content": "You are a tavern keeper in a medieval fantasy game. Speak cryptically."},
            {"role": "user", "content": "Tell me a rumor about the nearby ruins."}
        ],
        temperature=0.85,
        max_tokens=150
    )
    print("Character Response:\n", response.choices[0].message.content)

except AuthenticationError:
    print("[Error 401] Invalid or expired APIVALE API key. Please check your credentials.")
except RateLimitError:
    print("[Error 429] Rate limit reached. APIVALE gateway will automatically queue requests shortly.")
except APIError as e:
    print(f"[API Error] Gateway returned status {e.status_code}: {e.message}")
except Exception as e:
    print(f"[Unexpected Error] {str(e)}")
```

### TypeScript / Node.js Integration

Install the npm package:
```bash
npm install openai
```

Implement the TypeScript call:

```typescript
import OpenAI from 'openai';

// Initialize the SDK pointing to the APIVALE gateway
const openai = new OpenAI({
  apiKey: 'your_apivale_key_here',
  baseURL: 'https://api.apivale.com/v1',
});

async function runRoleplayPrompt() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gryphe/mythomax-l2-13b',
      messages: [
        { role: 'system', content: 'You are a futuristic AI guide lost in a digital labyrinth.' },
        { role: 'user', content: 'Help me find the exit node.' }
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    console.log('AI Guide:', completion.choices[0]?.message?.content);
  } catch (error: any) {
    if (error instanceof OpenAI.APIError) {
      console.error(`[API Error ${error.status}]: ${error.message}`);
    } else {
      console.error('[System Error]:', error.message);
    }
  }
}

runRoleplayPrompt();
```

---

<div class="cta-card">
  <h4 class="cta-card-title">🎭 Unlock Immersive Uncensored Roleplay on APIVALE</h4>
  <p class="cta-card-text">Say goodbye to rigid model safety rules and expensive GPU setups. Use APIVALE to route SillyTavern, custom chatbots, or gaming backend servers through our high-performance global network. Access Stheno v3.2, MythoMax, and other top-tier creative models starting at just $0.15 per million tokens. Register today and get free initial credits to start your adventure.</p>
  <div class="cta-card-actions">
    <a href="https://apivale.com/sign-up?utm_source=apivale_blog&utm_medium=blog&utm_campaign=sillytavern-stheno-mythomax-api-guide" class="cta-primary-btn">Get Your Free API Key Now</a>
    <a href="https://apivale.com/api/?utm_source=apivale_blog&utm_medium=blog&utm_campaign=sillytavern-stheno-mythomax-api-guide" class="cta-secondary-btn">View Full Model Pricing</a>
  </div>
</div>

---

## Developer FAQ

**Q: How do I resolve the "API Connection Refused" error in SillyTavern?**  
**A:** First, verify that the API URL is set exactly to `https://api.apivale.com/v1` and does not contain trailing slashes or sub-paths. Second, ensure that your APIVALE API key is valid and has sufficient credit balance. 

**Q: Which model is best for descriptive, high-speed mobile roleplay?**  
**A:** `sao10k/l3-stheno-8b` is highly recommended for mobile deployment. Built on Llama 3 8B, it offers exceptionally low latency (TTFT < 150ms) while producing highly expressive, immersive character dialogues.

**Q: Will my prompts remain private when using the APIVALE proxy?**  
**A:** Yes. APIVALE does not store prompt contents, completions, or user logs on its proxy servers. Requests are securely encrypted via HTTPS in transit and sent directly to our underlying compute nodes.

**Q: Does APIVALE support prompt caching for long chat sessions?**  
**A:** Yes. Since SillyTavern resubmits the entire history with every prompt, token counts grow. APIVALE automatically detects and caches unchanged chat history segments, applying a 90% discount on cache hits.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I resolve the \"API Connection Refused\" error in SillyTavern?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "First, verify that the API URL is set exactly to https://api.apivale.com/v1 and does not contain trailing slashes. Second, ensure that your APIVALE API key is valid and has sufficient credit balance."
      }
    },
    {
      "@type": "Question",
      "name": "Which model is best for descriptive, high-speed mobile roleplay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "sao10k/l3-stheno-8b is highly recommended for mobile deployment. Built on Llama 3 8B, it offers exceptionally low latency (TTFT < 150ms) while producing highly expressive, immersive character dialogues."
      }
    },
    {
      "@type": "Question",
      "name": "Will my prompts remain private when using the APIVALE proxy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. APIVALE does not store prompt contents, completions, or user logs on its proxy servers. Requests are securely encrypted via HTTPS in transit and sent directly to our underlying compute nodes."
      }
    },
    {
      "@type": "Question",
      "name": "Does APIVALE support prompt caching for long chat sessions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Since SillyTavern resubmits the entire history with every prompt, token counts grow. APIVALE automatically detects and caches unchanged chat history segments, applying a 90% discount on cache hits."
      }
    }
  ]
}
</script>
