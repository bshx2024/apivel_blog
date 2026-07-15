---
title: "Infrastructure for Hybrid LLM Agent Deployments"
description: "Configure a low-cost, high-performance infrastructure for hybrid LLM agent deployments. Route tasks between local MiniCPM5-1B and APIVALE cloud fallback."
date: "2026-07-15"
author: "Alex Rivera"
authorTitle: "Senior Cloud Architect, APIVALE"
authorBio: "Alex Rivera is a cloud infrastructure veteran specializing in high-concurrency systems and API gateway optimization."
tags: ["MiniCPM5-1B", "Hybrid LLM", "Local LLM", "LLM Costs", "Agentic Workflow"]
image: "/blog/minicpm-hybrid-agent.png"
lang: "en"
---

The rise of autonomous agent frameworks (like LangChain, LlamaIndex, and Cline) has introduced a major scaling bottleneck: **token cost inflation**. An agent executing a multi-step planning loop often generates thousands of trivial "thinking" and "data preprocessing" tokens. Running this entire loop on premium cloud models like Claude 3.5 Sonnet or GPT-4o quickly scales bills to hundreds of dollars for basic tasks.

At the same time, lightweight models like [MiniCPM5-1B](https://github.com/OpenBMB/MiniCPM) have demonstrated that 1-billion parameter models can run at over 200 tokens/second on consumer-grade hardware, delivering high-speed execution for simple parsing and formatting tasks.

The solution is establishing a resilient **infrastructure for hybrid LLM agent deployments**: routing low-complexity pre-processing, text cleaning, and routing tasks to a local MiniCPM5-1B instance (at $0 cost), while falling back to premium reasoning models via **APIVALE** only when complex decisions are required.

<img src="/blog/minicpm-hybrid-agent.png" alt="Hybrid LLM Agent Architecture routing from local edge MiniCPM5-1B to APIVALE cloud fallback models" width="800" height="420" loading="lazy" style="display: block; margin: 2.5rem auto 0.75rem; border-radius: 8px; border: 1px solid var(--surface-border); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);" />
*Architecture flow of the local edge pre-processing layer routing to APIVALE cloud fallback models.*

---

## Quick Start: Routing to Local and APIVALE Endpoints

Because APIVALE uses a standardized OpenAI-compatible format, switching between your local edge model and APIVALE’s cloud gateway requires nothing more than changing your `baseURL` and model string in your SDK:

```bash
# Query your local MiniCPM edge node
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "minicpm-1b", "messages": [{"role": "user", "content": "Clean this text."}]}'

# Query APIVALE's cloud reasoning models (e.g., DeepSeek-R1 / Claude 3.5 Sonnet)
curl https://apivale.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_APIVALE_KEY" \
  -d '{"model": "deepseek-r1", "messages": [{"role": "user", "content": "Optimize this database query."}]}'
```

---

## Designing the Infrastructure for Hybrid LLM Agent Deployments

To understand the benefits of a hybrid approach, let’s compare the three main deployment patterns for high-frequency developer agents:

| Feature | Pure Cloud Agent (Claude / GPT-4o) | Pure Local Agent (MiniCPM5-1B) | Hybrid (Local Edge + APIVALE) |
| :--- | :--- | :--- | :--- |
| **Token Cost** | Extremely High (Pay per token) | **$0.00 (Run on own hardware)** | **Low (80% Local, 20% Cloud)** |
| **Reasoning Ability** | Frontier Class (SOTA) | Basic (Fails on complex logic) | **Frontier Class (On-demand)** |
| **Inference Speed** | 30 - 80 tokens/sec | **200+ tokens/sec (Local CPU/GPU)** | **Fast execution + high throughput** |
| **Hardware Requirements** | None (Internet only) | Consumer Laptop (8GB RAM) | **Consumer Laptop (8GB RAM)** |
| **Onboarding Obstacles** | Stripe card declines, KYC verifications | None | **None (Bypass +86 phone & KYC walls)** |

---

<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">Hybrid Agent Architecture</h4>
  <p class="mt-2 text-sm text-gray-300">Hybrid Agent Architecture is an LLM orchestration pattern that routes low-tier tasks (such as token filtering, keyword classification, and initial formatting) to local edge models, and escalates high-complexity prompts to cloud-hosted reasoning models via a low-latency gateway.</p>
</div>

---

## Interactive Cost Savings Calculator

Evaluate the economic feasibility of establishing a hybrid agent infrastructure. Adjust the sliders below to estimate the monthly savings by routing simple agent queries to local models while keeping APIVALE for cloud fallback:

<div class="cost-calculator-widget">
<form id="savings-calculator-form" onsubmit="return false;">
<div class="widget-header">
<span class="widget-badge">Hybrid ROI Calculator</span>
<h3 class="widget-title">Calculate Your Monthly Agentic Savings</h3>
<p class="widget-subtitle">Specify your agent usage parameters below to compare Pure Cloud vs. Hybrid (Local + APIVALE) deployments</p>
</div>
<div class="widget-grid">
<div class="calculator-inputs">
<div class="calc-input-group">
<label for="calc-model">Cloud Fallback Model</label>
<div class="select-wrapper">
<select id="calc-model">
<option value="claude" selected>Claude 3.5 Sonnet ($6.00/M blended)</option>
<option value="gpt4o">GPT-4o ($4.00/M blended)</option>
<option value="deepseek">DeepSeek V4 ($0.168/M blended)</option>
</select>
</div>
</div>
<div class="calc-input-group">
<div class="slider-label-row">
<label for="queries-slider">Daily Agent Queries</label>
<div class="input-with-unit">
<input type="number" id="queries-num" min="10" max="2000" value="200" class="custom-number-input" />
<span class="unit-text">runs/day</span>
</div>
</div>
<input type="range" id="queries-slider" min="10" max="2000" value="200" class="custom-slider" />
</div>
<div class="calc-input-group">
<div class="slider-label-row">
<label for="tokens-slider">Avg. Tokens per Query</label>
<div class="input-with-unit">
<input type="number" id="tokens-num" min="1000" max="100000" value="10000" step="500" class="custom-number-input" />
<span class="unit-text">tokens</span>
</div>
</div>
<input type="range" id="tokens-slider" min="1000" max="100000" value="10000" step="500" class="custom-slider" />
</div>
<div class="calc-input-group">
<div class="slider-label-row">
<label for="ratio-slider">Local Routing Ratio (MiniCPM)</label>
<div class="input-with-unit">
<input type="number" id="ratio-num" min="10" max="95" value="80" class="custom-number-input" />
<span class="unit-text">% local</span>
</div>
</div>
<input type="range" id="ratio-slider" min="10" max="95" value="80" class="custom-slider" />
</div>
</div>
<div class="calculator-results">
<div class="cost-row">
<div class="cost-label">Pure Cloud Cost (Baseline)</div>
<div class="cost-value or-cost" id="baseline-cost-val">$360.00</div>
</div>
<div class="cost-row">
<div class="cost-label">Hybrid Cost (Local + APIVALE)</div>
<div class="cost-value apivale-cost" id="hybrid-cost-val">$72.00</div>
</div>
<div class="savings-card">
<div class="savings-percentage-row">
<span class="savings-badge">Total Cost Reduced</span>
<span class="savings-percentage" id="savings-pct-val">80.0%</span>
</div>
<div class="savings-amount" id="savings-amt-val">$288.00 / mo</div>
<p class="savings-note">⚡ Fully compatible with Ollama/llama.cpp SDK configurations. PayPal & crypto billing supported.</p>
<a href="https://apivale.com/sign-up?utm_source=apivale_blog&utm_medium=blog&utm_campaign=hybrid-llm-calc" class="calc-cta-btn">Claim Free $1.00 Credit</a>
</div>
</div>
</div>
</form>
</div>

<style>
.cost-calculator-widget {
background: rgba(15, 23, 42, 0.85);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
padding: 24px;
margin: 32px 0;
color: #f1f5f9;
box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
.widget-header {
margin-bottom: 24px;
}
.widget-badge {
background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
color: #ffffff;
font-size: 0.7rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
padding: 4px 10px;
border-radius: 20px;
display: inline-block;
margin-bottom: 8px;
}
.widget-title {
font-size: 1.35rem;
font-weight: 700;
margin: 0 0 6px 0;
color: #ffffff;
}
.widget-subtitle {
font-size: 0.85rem;
color: #94a3b8;
margin: 0;
line-height: 1.4;
}
.widget-grid {
display: grid;
grid-template-columns: 1.2fr 1fr;
gap: 32px;
}
.calculator-inputs {
display: flex;
flex-direction: column;
gap: 20px;
}
.calc-input-group {
display: flex;
flex-direction: column;
gap: 8px;
}
.calc-input-group label {
font-size: 0.85rem;
font-weight: 600;
color: #e2e8f0;
}
.select-wrapper {
position: relative;
}
.select-wrapper select {
width: 100%;
background: rgba(30, 41, 59, 0.8);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 8px;
padding: 10px 14px;
color: #f1f5f9;
font-size: 0.9rem;
cursor: pointer;
appearance: none;
-webkit-appearance: none;
}
.select-wrapper::after {
content: '▾';
position: absolute;
right: 14px;
top: 50%;
transform: translateY(-50%);
color: #94a3b8;
pointer-events: none;
}
.slider-label-row {
display: flex;
justify-content: space-between;
align-items: center;
}
.input-with-unit {
display: flex;
align-items: center;
background: rgba(30, 41, 59, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 6px;
padding: 2px 8px;
}
.custom-number-input {
width: 70px;
background: transparent;
border: none;
color: #ffffff;
font-family: inherit;
font-size: 0.85rem;
font-weight: 600;
text-align: right;
padding: 4px;
}
.custom-number-input:focus {
outline: none;
}
.unit-text {
font-size: 0.75rem;
color: #64748b;
margin-left: 4px;
}
.custom-slider {
width: 100%;
height: 6px;
background: #334155;
border-radius: 3px;
outline: none;
-webkit-appearance: none;
}
.custom-slider::-webkit-slider-thumb {
-webkit-appearance: none;
width: 16px;
height: 16px;
border-radius: 50%;
background: #6366f1;
cursor: pointer;
transition: background 0.15s;
}
.custom-slider::-webkit-slider-thumb:hover {
background: #818cf8;
}
.calculator-results {
display: flex;
flex-direction: column;
justify-content: space-between;
gap: 16px;
}
.cost-row {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 0;
border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.cost-label {
font-size: 0.85rem;
color: #94a3b8;
}
.cost-value {
font-size: 1.1rem;
font-weight: 600;
}
.or-cost {
color: #f43f5e;
}
.apivale-cost {
color: #f1f5f9;
font-weight: 700;
}
.savings-card {
background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%);
border: 1px solid rgba(16, 185, 129, 0.3);
border-radius: 10px;
padding: 16px;
text-align: center;
position: relative;
overflow: hidden;
box-shadow: 0 4px 20px rgba(16, 185, 129, 0.05);
}
.savings-percentage-row {
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
margin-bottom: 6px;
}
.savings-badge {
background: #10b981;
color: #ffffff;
font-size: 0.65rem;
font-weight: 800;
text-transform: uppercase;
padding: 2px 6px;
border-radius: 4px;
}
.savings-percentage {
font-size: 1.4rem;
font-weight: 800;
color: #10b981;
}
.savings-amount {
font-size: 1.2rem;
font-weight: 700;
color: #ffffff;
margin-bottom: 8px;
}
.savings-note {
font-size: 0.72rem;
color: #a7f3d0;
margin: 0 0 14px 0;
line-height: 1.4;
}
.calc-cta-btn {
display: block;
background: #10b981;
color: #ffffff !important;
font-size: 0.85rem;
font-weight: 700;
text-align: center;
text-decoration: none !important;
padding: 10px 16px;
border-radius: 6px;
box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
transition: all 0.2s;
}
.calc-cta-btn:hover {
background: #059669;
transform: translateY(-1px);
box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}
@media (max-width: 640px) {
.widget-grid {
grid-template-columns: 1fr;
gap: 20px;
}
}
</style>

<script is:inline>
(function() {
  const modelRates = {
    claude: 6.00,
    gpt4o: 4.00,
    deepseek: 0.168
  };
  const modelSelect = document.getElementById('calc-model');
  const queriesSlider = document.getElementById('queries-slider');
  const tokensSlider = document.getElementById('tokens-slider');
  const ratioSlider = document.getElementById('ratio-slider');
  
  const queriesNum = document.getElementById('queries-num');
  const tokensNum = document.getElementById('tokens-num');
  const ratioNum = document.getElementById('ratio-num');
  
  const baselineDisp = document.getElementById('baseline-cost-val');
  const hybridDisp = document.getElementById('hybrid-cost-val');
  const savingsPctDisp = document.getElementById('savings-pct-val');
  const savingsAmtDisp = document.getElementById('savings-amt-val');
  
  if (!modelSelect || !queriesSlider || !tokensSlider || !ratioSlider) return;
  
  function calculate() {
    const rate = modelRates[modelSelect.value];
    const dailyQueries = parseFloat(queriesSlider.value);
    const tokensPerQuery = parseFloat(tokensSlider.value);
    const localRatio = parseFloat(ratioSlider.value) / 100;
    
    const monthlyTokens = dailyQueries * 30 * tokensPerQuery;
    const baselineCost = (monthlyTokens / 1000000) * rate;
    const hybridCost = (monthlyTokens / 1000000) * (1 - localRatio) * rate;
    const savings = baselineCost - hybridCost;
    
    baselineDisp.textContent = '$' + baselineCost.toFixed(2);
    hybridDisp.textContent = '$' + hybridCost.toFixed(2);
    savingsPctDisp.textContent = (localRatio * 100).toFixed(0) + '%';
    savingsAmtDisp.textContent = '$' + savings.toFixed(2) + ' / mo';
  }
  
  queriesSlider.addEventListener('input', function() {
    queriesNum.value = queriesSlider.value;
    calculate();
  });
  queriesNum.addEventListener('input', function() {
    let val = parseInt(queriesNum.value) || 10;
    if (val < 10) val = 10;
    if (val > 2000) val = 2000;
    queriesSlider.value = val;
    calculate();
  });
  
  tokensSlider.addEventListener('input', function() {
    tokensNum.value = tokensSlider.value;
    calculate();
  });
  tokensNum.addEventListener('input', function() {
    let val = parseInt(tokensNum.value) || 1000;
    if (val < 1000) val = 1000;
    if (val > 100000) val = 100000;
    tokensSlider.value = val;
    calculate();
  });
  
  ratioSlider.addEventListener('input', function() {
    ratioNum.value = ratioSlider.value;
    calculate();
  });
  ratioNum.addEventListener('input', function() {
    let val = parseInt(ratioNum.value) || 10;
    if (val < 10) val = 10;
    if (val > 95) val = 95;
    ratioSlider.value = val;
    calculate();
  });
  
  modelSelect.addEventListener('change', calculate);
  calculate();
})();
</script>

---

## Step 1: Running MiniCPM5-1B Locally

MiniCPM5-1B is optimized for running on CPU and low-end GPU environments. You can run it locally using standard tools like [llama.cpp](https://github.com/ggerganov/llama.cpp) or [Ollama](https://ollama.com/).

### 1. Running with [Ollama](https://ollama.com/)
If you have Ollama installed, run:
```bash
ollama run minicpm:1b
```
This automatically exposes a local OpenAI-compatible endpoint at `http://localhost:11434/v1`.

### 2. Running with llama.cpp
For maximum performance on Apple Silicon or standard Windows CPU rigs, compile `llama.cpp` and download the quantized GGUF version of MiniCPM5-1B:
```bash
./llama-server -m minicpm-5-1b-Q4_K_M.gguf --port 8080
```
This exposes your local server at `http://localhost:8080/v1`.

---

## Step 2: Implementation of the Hybrid Router

Here is a ready-to-run Python script demonstrating how to build a dynamic routing class. The router uses the local MiniCPM5-1B for initial evaluation and tasks like JSON cleaning. If the task is flagged as highly complex (or if the local model indicates it requires higher reasoning), it falls back to APIVALE.

```python
import os
import openai
from openai import OpenAI

# Initialize standard clients
local_client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="local-placeholder"
)

# APIVALE client handles cloud fallback
apivale_client = OpenAI(
    base_url="https://apivale.com/v1",
    api_key=os.environ.get("APIVALE_API_KEY", "YOUR_APIVALE_KEY")
)

def analyze_complexity(prompt: str) -> bool:
    """
    Evaluates whether the prompt requires high-level reasoning.
    Uses local model for fast classification.
    """
    try:
        classifier_prompt = (
            "Classify the following prompt. If it requires complex software coding, "
            "mathematical calculations, or advanced strategic reasoning, reply with 'HARD'. "
            "Otherwise, reply with 'EASY'.\n\n"
            f"Prompt: {prompt}\nClassification:"
        )
        
        response = local_client.chat.completions.create(
            model="minicpm-1b",
            messages=[{"role": "user", "content": classifier_prompt}],
            max_tokens=5,
            temperature=0.0
        )
        result = response.choices[0].message.content.strip().upper()
        return "HARD" in result
    except Exception:
        # Fallback to true (send to cloud) if local server is unresponsive
        return True

def execute_agent_task(prompt: str):
    is_hard = analyze_complexity(prompt)
    
    if is_hard:
        print("⚡ [Router] Esculating to APIVALE Cloud Fallback...")
        response = apivale_client.chat.completions.create(
            model="deepseek-r1",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        return response.choices[0].message.content
    else:
        print("💻 [Router] Executing task locally on MiniCPM5-1B...")
        response = local_client.chat.completions.create(
            model="minicpm-1b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        return response.choices[0].message.content

# Example Execution
if __name__ == "__main__":
    easy_task = "Extract all dates from this log: [2026-07-15 10:12:00] User logged in."
    hard_task = "Write a high-concurrency connection pool manager in Go with timeout fallbacks."
    
    print(execute_agent_task(easy_task))
    print("\n" + "="*40 + "\n")
    print(execute_agent_task(hard_task))
```

---

## Resolving Developer Onboarding Barriers with APIVALE

When deploying hybrid agents, developers often choose cloud gateways like OpenRouter. However, OpenRouter and standard providers enforce strict billing checks (Stripe) that frequently flag international credit cards, leading to abrupt API suspension. 

Additionally, accessing top-tier Chinese models (like DeepSeek V4 or GLM-5.2) directly requires mainland phone numbers (+86 SMS verification) and identity card uploads (KYC).

APIVALE bypasses these barriers entirely:
1. **Unified Base URL**: The API format is 100% compatible with local Ollama/llama.cpp engines. You only swap your server URL to scale.
2. **Stable PayPal Billing**: Fund your API account with standard global cards, PayPal, or Crypto (USDT/USDC) without the risk of false fraud suspensions.
3. **No KYC Walls**: Get instant access to DeepSeek V4, Zhipu GLM-5.2, and Tencent Hunyuan without providing a mainland phone number or ID.
4. **$1.00 Free Trial**: Register with any email and receive $1.00 in free trial credits immediately.

*(For a deep dive into bypassing mainland registration limits, read our guide on [How to Access Tencent Hunyuan Hy3 and DeepSeek V4 API Outside China](/blog/how-to-access-hy3-deepseek-without-86-phone/). If you are evaluating alternative routing platforms, see our comparison of the [5 Best OpenRouter Alternatives](/blog/openrouter-alternatives/).)*

---

<div class="cta-card">
  <h4 class="cta-card-title">🎁 Try APIVALE with $1.00 Free Credits</h4>
  <p class="cta-card-text">Set up your hybrid LLM agent workflows without billing or registration hurdles. Get instant access to GPT-5.5, Claude 4 Sonnet, DeepSeek V4, and GLM-5.2 via a single OpenAI-compatible API key. Register with your Google/GitHub account and claim your free $1.00 starting balance today.</p>
  <div class="cta-card-actions">
    <a href="https://apivale.com/sign-up?utm_source=apivale_blog&utm_medium=blog&utm_campaign=infrastructure-for-hybrid-llm-agent-deployments" class="cta-primary-btn">Create Free Account</a>
    <a href="https://apivale.com/docs?utm_source=apivale_blog&utm_medium=blog&utm_campaign=infrastructure-for-hybrid-llm-agent-deployments" class="cta-secondary-btn">Read Integration Docs</a>
  </div>
</div>

---

## Developer FAQ

**Q: What hardware is required to set up an infrastructure for hybrid LLM agent deployments?**  
**A:** A hybrid LLM agent infrastructure runs efficiently on consumer-grade hardware. A standard developer laptop with 8GB of RAM is sufficient to host the local MiniCPM5-1B edge layer (via Ollama or llama.cpp) for preprocessing. The system then routes complex reasoning queries to APIVALE's cloud gateway over any standard internet connection.

**Q: Can MiniCPM5-1B handle structured JSON outputs?**  
**A:** Yes. When running MiniCPM5-1B via Ollama or llama.cpp, you can pass structured JSON grammar or system prompt rules to force the model to output valid JSON. This is ideal for extracting and formatting variables before sending data to the cloud.

**Q: How do I change the model from MiniCPM to APIVALE in Cursor?**  
**A:** In Cursor settings, disable the default models, add `https://apivale.com/v1` as your custom endpoint, and input your APIVALE key. You can then select any model (like Claude 3.5 Sonnet or DeepSeek) to use inside your editor workspace.

**Q: Is there any latency overhead when using a hybrid router?**  
**A:** Running the classification step locally takes less than 25-50ms because MiniCPM5-1B runs directly in memory. This small overhead is offset by the massive token and cost savings achieved by not sending every request to the cloud.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What hardware is required to set up an infrastructure for hybrid LLM agent deployments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A hybrid LLM agent infrastructure runs efficiently on consumer-grade hardware. A standard developer laptop with 8GB of RAM is sufficient to host the local MiniCPM5-1B edge layer (via Ollama or llama.cpp) for preprocessing. The system then routes complex reasoning queries to APIVALE's cloud gateway over any standard internet connection."
      }
    },
    {
      "@type": "Question",
      "name": "Can MiniCPM5-1B handle structured JSON outputs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. When running MiniCPM5-1B via Ollama or llama.cpp, you can pass structured JSON grammar or system prompt rules to force the model to output valid JSON. This is ideal for extracting and formatting variables before sending data to the cloud."
      }
    },
    {
      "@type": "Question",
      "name": "How do I change the model from MiniCPM to APIVALE in Cursor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In Cursor settings, disable the default models, add https://apivale.com/v1 as your custom endpoint, and input your APIVALE key. You can then select any model (like Claude 3.5 Sonnet or DeepSeek) to use inside your editor workspace."
      }
    },
    {
      "@type": "Question",
      "name": "Is there any latency overhead when using a hybrid router?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Running the classification step locally takes less than 25-50ms because MiniCPM5-1B runs directly in memory. This small overhead is offset by the massive token and cost savings achieved by not sending every request to the cloud."
      }
    }
  ]
}
</script>

