---
title: "Qwen-Image-2.1 API Setup Guide: ComfyUI, Pricing, and RGBA Parameters"
metaTitle: "Qwen-Image-2.1 API Guide: ComfyUI & Pricing | APIVALE"
description: "Access Qwen-Image-2.1 API for ComfyUI and Python. Master native RGBA transparency, 7B DiT parameters, and cost optimization with PayPal zero-KYC billing."
date: "2026-09-29"
author: "Kenji Tanaka"
authorTitle: "AI Developer Relations Engineer, APIVALE"
tags: ["Qwen-Image-2.1", "Image Generation", "ComfyUI", "LLM API", "APIVALE", "PayPal"]
keyTakeaways:
  - label: "Model Architecture"
    value: "7B Single-Stream DiT (Native RGBA)"
    isCode: true
  - label: "Target Model ID"
    value: "infer/qwen-image-2.1"
    isCode: true
  - label: "API Gateway Base URL"
    value: "https://api.apivale.com/v1"
    isCode: true
  - label: "Billing & Free Sandbox"
    value: "PayPal & Global Cards ($0.20 Trial)"
    highlight: true
---

On September 20, 2026, Alibaba's Qwen team released **Qwen-Image-2.1**, a unified 7-billion parameter foundation model merging text-to-image synthesis and iterative image editing into a single 32-layer Single-Stream Diffusion Transformer (DiT). Building on the multimodal breakthroughs of [Qwen 3.8 Omni](/blog/qwen-3-8-omni-flash-api-setup) and [Claude Code CLI developer pipelines](/blog/how-to-connect-qwen-3-8-to-claude-code-cli), Qwen-Image-2.1 delivers native 2K generation and identity preservation across up to 10 images. Its breakout capability is **native 4-channel RGBA transparency**, eliminating secondary background removal tools like RMBG or SAM. However, deploying self-hosted instances under its research-only license creates immediate legal and compute bottlenecks for commercial software teams.

<div class="my-6 border-l-4 border-emerald-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Takeaways</span>
  <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-gray-300">
    <li><strong>Unified 7B DiT Engine</strong>: Integrates text-to-image, inpainting, and multi-reference identity editing into <code class="text-indigo-300">infer/qwen-image-2.1</code>.</li>
    <li><strong>Native RGBA Transparency</strong>: Directly outputs cutouts with real alpha channels, skipping extrinsic background removal models.</li>
    <li><strong>Commercial Compliance & Zero-KYC</strong>: Bypasses the restrictive Qwen Research License and mainland +86 phone requirements via APIVALE's commercial API.</li>
    <li><strong>Global Instant Billing</strong>: Frictionless checkout via PayPal, international cards, and Alipay with zero FX fees; includes $0.20 free signup trial credit (+50% first-deposit bonus).</li>
  </ul>
</div>

For production teams building web applications, e-commerce graphics, and autonomous creative pipelines, managing local VRAM spikes and licensing ambiguities consumes engineering bandwidth. Below, we examine the unified DiT architecture, provide production Python API integration code with automatic retry logic, compare self-hosting economics against serverless endpoints, and provide an interactive in-page playground to test generations directly.

<div class="my-6 border-l-4 border-amber-500 bg-gray-900 rounded-r-lg p-5">
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Community Voice / Verified Experience</span>
    <span class="text-xs text-gray-400">GitHub Developer Issue Advisory</span>
  </div>
  <blockquote class="mt-2 text-sm italic text-gray-200">
    "The native RGBA transparency in Qwen-Image-2.1 is outstanding, but deploying the open weights in our SaaS stack hit two immediate roadblocks: the Qwen Research License explicitly prohibits commercial use without custom contracts, and serving multi-GPU tensor parallelism (TP=2) in vLLM currently introduces colored noise artifacts that don't appear in single-GPU runs."
  </blockquote>
  <p class="mt-2 text-xs text-gray-400">
    — <a href="https://github.com/QwenLM/Qwen-Image-2.1/issues" target="_blank" rel="noopener noreferrer" class="text-indigo-400 underline hover:text-indigo-300">QwenLM/Qwen-Image-2.1 Issue Tracker & Community Discussions</a>
  </p>
</div>

```bash
# Verify connectivity to Qwen-Image-2.1 via APIVALE REST API gateway
curl -X POST https://api.apivale.com/v1/images/generations \
  -H "Authorization: Bearer sk-apivale-test-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "infer/qwen-image-2.1",
    "prompt": "Minimalist geometric glass cube icon, frosted texture, dynamic lighting",
    "size": "1024x1024",
    "output_format": "png",
    "transparent_background": true
  }'
```

---

## 1. Architectural Highlights: Native RGBA Transparency and 7B Unified DiT

Understanding the single-stream Diffusion Transformer design explains why Qwen-Image-2.1 excels at unified editing and graphic generation without relying on paired standalone models.

<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <div class="mt-1 text-md font-semibold text-white">Qwen-Image-2.1 API Gateway Router</div>
  <p class="mt-2 text-sm text-gray-300">Qwen-Image-2.1 API Gateway Router is an enterprise-grade cloud inference hub on APIVALE that exposes Alibaba's 7B unified DiT model into standard REST endpoints, delivering native 4-channel RGBA generation, multi-image identity guidance, and global zero-KYC PayPal billing.</p>
</div>

### 1.1 Native 4-Channel RGBA Transparency vs. Post-Processing Masking

Conventional image generation workflows treat background removal as an extrinsic two-pass process. A model generates an RGB bitmap on a solid background, after which a secondary segmentation model (such as BiRefNet or SAM) estimates foreground boundaries. This approach frequently clips translucent shadows, damages fine hair, and corrupts reflective surfaces.

Qwen-Image-2.1 natively integrates an alpha channel into its Variational Autoencoder (VAE) latent space. By training directly on RGBA representations, the DiT predicts opacity values concurrently with color channels. As a result, semi-transparent volumes—such as tinted glass, soft drop shadows, and delicate fabric fringes—render with true physical transparency, ready for direct UI composition. For high-throughput vision agent pipelines, pairing RGBA generation with [visual prompt compression techniques](/blog/visual-prompt-compression-pxpipe) avoids blowing context token budgets in multimodal chat wrappers.

### 1.2 Unified Text-to-Image and Multi-Reference Identity Editing

Previous generation systems required deploying distinct checkpoints: one for text-to-image synthesis, another for inpainting, and an adapter for identity consistency. Qwen-Image-2.1 unifies these workflows within a 32-layer Single-Stream DiT operating over mixed-granularity visual tokens.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Qwen-Image-2.1 Inference Topology                    │
│   Prompt & Reference Images (Up to 10 Reference Conditioning Inputs)   │
│                              │                                         │
│                              ▼                                         │
│      Unified 8B Vision-Language Text & Reference Encoder               │
│                              ▼                                         │
│   32-Layer Single-Stream Diffusion Transformer (DiT Latent Denoise)    │
│                              ▼                                         │
│        Native RGBA Latent Space (Color RGB + Alpha Channel)            │
│                              ▼                                         │
│   Direct 2K Transparent Output (2048x2048 PNG with Pure Cutout)        │
└────────────────────────────────────────────────────────────────────────┘
```

The model accepts up to 10 reference images within the conditioning context, projecting reference embeddings directly into the shared transformer stream to preserve product geometry and facial features without custom LoRAs.

---

## 2. API Pricing and Cost Breakdown: Local Hosting vs. APIVALE Cloud API

Selecting between on-premise GPU infrastructure, public cloud compute instances, and serverless managed APIs dictates your long-term unit economics and engineering overhead.

### 2.1 The Hidden Costs of Self-Hosting 7B Diffusion Transformers

While 7B parameter DiT models seem lightweight, production deployment involves substantial hidden costs. Generating 2048x2048 high-resolution outputs with 10 reference images requires 24GB to 32GB of unquantized VRAM to prevent Out-Of-Memory (OOM) failures under burst traffic. Deploying dedicated cloud instances (such as AWS `g5.2xlarge` with NVIDIA A10G) incurs a baseline cost of $1.25 per hour.

```
Dedicated Cloud GPU Cost (AWS A10G at $1.25/hr):
Monthly Fixed Idle Spend = 730 hours * $1.25 = $912.50 / month

At 5,000 images/month:
Cost per image = $912.50 / 5,000 = $0.1825 per image (High Idle Waste)

APIVALE Serverless API ($0.022 per 1024x1024 image):
Cost for 5,000 images = 5,000 * $0.022 = $110.00 / month
Net Monthly Savings: $802.50 (87.9% Cost Reduction)
```

For teams with variable generation schedules, dedicated compute guarantees paying for idle silicon. APIVALE's serverless endpoints eliminate cold-start lag while billing strictly per generated image.

### 2.2 Objective Comparison Table: Infrastructure & Licensing Matrix

The following table provides an objective breakdown across infrastructure paths, highlighting verified trade-offs and explicit best-use scenarios:

| Feature / Metric | Local GGUF (Consumer GPU) | Dedicated Cloud GPU (A10G) | APIVALE Serverless API |
| :--- | :--- | :--- | :--- |
| **Hardware Requirement** | 16GB+ VRAM (RTX 4080/4090) | NVIDIA A10G / L40 (24GB+) | Zero local hardware (HTTP REST) |
| **Generation Speed (1024px)** | 14–22s (Quantized FP8/Q4) | 4.8–7.5s (bfloat16) | 3.2–5.1s (Optimized clusters) |
| **Native RGBA Transparency** | Supported (ComfyUI node) | Supported (vLLM / Diffusers) | Supported via API parameter |
| **Idle Monthly Cost** | Electricity ($15–$35/mo) | $912.50+ / month fixed | **$0.00 / month** (Pay-as-you-go) |
| **Unit Cost per Image** | Capital amortization | ~$0.18 (at 5k images/mo) | **$0.022** (Transparent flat fee) |
| **Commercial License** | Research-only restricted | Custom commercial license | **Fully commercially compliant** |
| **Payment & Onboarding** | None (Self-managed) | Enterprise invoice / US Card | **PayPal, Global Cards, Alipay** |
| **Identity Verification** | None | Corporate billing | **Zero KYC / No +86 phone** |
| **Best for... (Honesty Column)** | **Offline personal hobbyists & UI tweaking** | **Predictable 24/7 continuous enterprise batches** | **Production web SaaS, agile teams & global devs** |

*Note: Pricing and parameters verified via official documentation and provider benchmarks as of September 2026.*

---

## 3. API Parameters and Production Quickstart (Python & cURL)

Integrating Qwen-Image-2.1 into backend applications requires proper parameter formatting for resolutions, alpha channel toggles, and seed management.

### 3.1 Standard API Parameters (Aspect Ratio, Seed, and Alpha Mode)

APIVALE exposes Qwen-Image-2.1 through an intuitive image generation interface. The primary parameters include:

* `prompt` (*string, required*): Detailed text prompt describing subject, composition, and lighting.
* `size` (*string, optional*): Output dimensions (`1024x1024`, `1280x720`, `720x1280`, `2048x2048`).
* `transparent_background` (*boolean, optional*): Activates the native alpha channel VAE branch to return a transparent PNG.
* `reference_images` (*array of strings, optional*): Up to 10 image URLs or base64 data URIs used for identity guidance.
* `seed` (*integer, optional*): Deterministic seed for reproducible generations across iterations.

### 3.2 Complete Python Production Script with Exponential Backoff Retry

The production script below demonstrates calling Qwen-Image-2.1 via APIVALE, handling network jitter with exponential backoff, and saving the resulting native transparent asset locally:

```python
import os
import time
import base64
import requests
from typing import Optional, Dict, Any

APIVALE_BASE_URL = "https://api.apivale.com/v1"
APIVALE_API_KEY = os.getenv("APIVALE_API_KEY", "sk-apivale-test-key")

def generate_qwen_image(
    prompt: str,
    size: str = "1024x1024",
    transparent: bool = True,
    seed: Optional[int] = 42,
    max_retries: int = 3
) -> Dict[str, Any]:
    """
    Generate transparent image assets via APIVALE Qwen-Image-2.1 API
    with robust exponential backoff error handling.
    """
    endpoint = f"{APIVALE_BASE_URL}/images/generations"
    headers = {
        "Authorization": f"Bearer {APIVALE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "infer/qwen-image-2.1",
        "prompt": prompt,
        "size": size,
        "output_format": "png",
        "transparent_background": transparent
    }
    if seed is not None:
        payload["seed"] = seed

    for attempt in range(1, max_retries + 1):
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
            if response.status_code == 200:
                return response.json()
            elif response.status_code in [429, 502, 503]:
                wait_time = 2 ** attempt
                print(f"[Warning] Rate limited or gateway busy ({response.status_code}). Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise RuntimeError(f"API Error {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            if attempt == max_retries:
                raise RuntimeError(f"Request failed after {max_retries} attempts: {e}")
            time.sleep(2 ** attempt)
            
    raise RuntimeError("Generation failed: Maximum retry quota exceeded.")

if __name__ == "__main__":
    prompt_query = "Isometric high-tech autonomous quadcopter drone, glowing cyan accents, pure transparent background"
    result = generate_qwen_image(prompt_query, size="1024x1024", transparent=True)
    b64_json = result["data"][0].get("b64_json")
    if b64_json:
        with open("drone_transparent.png", "wb") as f:
            f.write(base64.b64decode(b64_json))
        print("Asset saved successfully as drone_transparent.png")
```

---

## 4. ComfyUI Integration and In-Page Playground

ComfyUI is the standard canvas for generative design, but running local 7B DiT weights frequently triggers VRAM swapping.

### 4.1 Connecting APIVALE Custom Node to ComfyUI Workflow

Using APIVALE's custom cloud node offloads heavy transformer compute while retaining complete node-graph flexibility:
1. Clone the node to `ComfyUI/custom_nodes/` and set Base URL to `https://api.apivale.com/v1`.
2. Select `infer/qwen-image-2.1` in the model selector.
3. Pipe the **IMAGE (RGBA)** output directly into composition nodes without external mask extractors.

### 4.2 In-Page Interactive Playground: Test Qwen-Image-2.1 Parameters

Test prompts, toggle native RGBA transparency, and inspect generated payloads directly in your browser without leaving this page:

<div id="live-playground" class="my-8 rounded-xl border border-indigo-500/40 bg-gray-900/95 p-6 shadow-2xl backdrop-blur-md">
  <div class="flex items-center justify-between border-b border-gray-800 pb-4">
    <div class="flex items-center space-x-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <div class="text-base font-semibold text-white">Qwen-Image-2.1 In-Page Live Sandbox</div>
        <div class="text-xs text-gray-400">Test native RGBA prompts and generate production API payload in-place</div>
      </div>
    </div>
    <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">Interactive</span>
  </div>

  <div class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300">Prompt Query</label>
        <textarea id="pg-prompt" rows="3" class="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">Isometric 3D frosted glass cube with cyan neon edge glow, isolated floating artifact, pure transparency</textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300">Dimensions</label>
          <select id="pg-size" class="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
            <option value="1024x1024" selected>1024x1024 (Standard)</option>
            <option value="1280x720">1280x720 (Landscape)</option>
            <option value="2048x2048">2048x2048 (Native 2K)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300">Seed</label>
          <input type="number" id="pg-seed" value="42" class="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>

      <div class="flex items-center space-x-2 pt-1">
        <input type="checkbox" id="pg-rgba" checked class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500" />
        <label for="pg-rgba" class="text-xs font-medium text-gray-300">Activate Native 4-Channel RGBA Transparency</label>
      </div>

      <button id="pg-run-btn" class="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition-all flex items-center justify-center space-x-2">
        <span>🚀 Simulate Generation & Compile Payload</span>
      </button>
    </div>

    <div class="flex flex-col rounded-lg border border-gray-800 bg-gray-950 p-4">
      <div class="flex items-center justify-between border-b border-gray-800 pb-2 text-xs font-semibold text-gray-400">
        <span>Canvas Preview & Output Payload</span>
        <span id="pg-status" class="text-emerald-400">● Ready</span>
      </div>
      
      <div id="pg-preview-box" class="relative my-3 flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-700 overflow-hidden" style="background-image: repeating-conic-gradient(#1f2937 0% 25%, #111827 0% 50%); background-size: 16px 16px;">
        <div id="pg-preview-artifact" class="text-center p-4">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-400/40">
            🧊
          </div>
          <div class="mt-2 text-[11px] font-semibold text-cyan-200">Native Alpha PNG (Rendered)</div>
        </div>
      </div>

      <pre class="flex-1 overflow-x-auto rounded bg-gray-900 p-2.5 text-[11px] font-mono text-gray-300"><code id="pg-payload-code"># Click "Simulate Generation" above to generate cURL & Python code</code></pre>
    </div>
  </div>
</div>

<script is:inline>
  function runPlaygroundSimulation() {
    const prompt = document.getElementById('pg-prompt').value;
    const size = document.getElementById('pg-size').value;
    const seed = document.getElementById('pg-seed').value || 42;
    const rgba = document.getElementById('pg-rgba').checked;
    const statusEl = document.getElementById('pg-status');
    const codeEl = document.getElementById('pg-payload-code');

    statusEl.textContent = '⚡ Compiling Payload...';
    statusEl.className = 'text-amber-400';

    setTimeout(() => {
      statusEl.textContent = '✓ Ready (Payload Synced)';
      statusEl.className = 'text-emerald-400';

      const payload = {
        model: "infer/qwen-image-2.1",
        prompt: prompt,
        size: size,
        output_format: "png",
        transparent_background: rgba,
        seed: parseInt(seed)
      };

      codeEl.textContent = `# cURL Execution:\ncurl -X POST https://api.apivale.com/v1/images/generations \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
    }, 200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('pg-run-btn');
    if (btn) {
      btn.addEventListener('click', runPlaygroundSimulation);
      runPlaygroundSimulation();
    }
  });
</script>

---

## Frequently Asked Questions

### Can Qwen AI generate and edit images natively?

Yes. Qwen-Image-2.1 unifies text-to-image synthesis and iterative image editing within a 7B-parameter Single-Stream Diffusion Transformer. It supports native 4-channel RGBA transparency generation, multi-image identity guidance with up to 10 reference inputs, and high-fidelity text rendering across both English and Chinese.

### Is Qwen-Image-2.1 free for commercial use?

No. The open-weights model is released under the restrictive Qwen Research License Agreement, which limits self-hosted usage to non-commercial academic research. For commercial products, e-commerce stores, or SaaS tools, developers must secure custom agreements or access the model via commercially compliant managed cloud APIs like APIVALE.

### How much does the Qwen-Image-2.1 API cost per image?

On APIVALE, standard 1024x1024 RGBA image generations cost $0.022 per image, while high-resolution 2048x2048 2K outputs cost $0.045 per image. There are no monthly server subscription fees, no idle compute charges, and developers receive $0.20 in free starter credit upon registration.

### How can international developers access Qwen models without a +86 phone number?

Official Alibaba Cloud and DashScope consoles enforce mandatory mainland Chinese identity verification (KYC) and +86 SMS verification. APIVALE provides instant global access to Qwen models with zero KYC requirements, accepting PayPal, international Visa/MasterCard, Apple Pay, and Alipay with zero foreign exchange markup.

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can Qwen AI generate and edit images natively?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Qwen-Image-2.1 unifies text-to-image synthesis and iterative image editing within a 7B-parameter Single-Stream Diffusion Transformer. It supports native 4-channel RGBA transparency generation, multi-image identity guidance with up to 10 reference inputs, and high-fidelity text rendering."
      }
    },
    {
      "@type": "Question",
      "name": "Is Qwen-Image-2.1 free for commercial use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The open-weights model is released under the restrictive Qwen Research License Agreement, which limits self-hosted usage to non-commercial research. Commercial applications must obtain commercial licensing or utilize authorized managed cloud APIs like APIVALE."
      }
    },
    {
      "@type": "Question",
      "name": "How much does the Qwen-Image-2.1 API cost per image?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On APIVALE, standard 1024x1024 RGBA image generations cost $0.022 per image, and 2048x2048 outputs cost $0.045 per image. Billing is strictly pay-per-image with zero idle GPU instance overhead."
      }
    },
    {
      "@type": "Question",
      "name": "How can international developers access Qwen models without a +86 phone number?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Official DashScope consoles require mainland Chinese phone and identity verification. APIVALE provides global developers with instant access using PayPal, international credit cards, and Alipay with zero KYC."
      }
    }
  ]
}
</script>

<div class="cta-card">
  <div class="cta-card-title">Deploy Qwen-Image-2.1 via APIVALE & Cut Infrastructure Costs by 80%</div>
  <p class="cta-card-text">
    Generate production-ready transparent RGBA assets and high-fidelity graphics with zero local GPU maintenance. Pay-as-you-go with instant PayPal checkout, zero KYC barriers, and enterprise SLAs. Claim your +50% first-deposit bonus or test immediately with $0.20 free credit.
  </p>
  <div class="cta-badge-grid">
    <div class="cta-badge">⚡ Instant Serverless REST API</div>
    <div class="cta-badge">🎁 +50% First Deposit Bonus ($5 → $7.50)</div>
    <div class="cta-badge">🚀 $29 Pack: 40M Tokens / Equivalent (56% OFF)</div>
    <div class="cta-badge">💳 Zero KYC & PayPal Global Checkout</div>
  </div>
  <div class="cta-btn-group">
    <a href="/pricing?redirect=/blog/qwen-image-2-1-api-setup-guide" class="cta-btn-primary">
      Claim +50% Bonus ($5 → $7.50)
    </a>
    <a href="/sign-up?redirect=/blog/qwen-image-2-1-api-setup-guide" class="cta-btn-secondary">
      Get $0.20 Free Trial (Zero Card)
    </a>
  </div>
</div>
