# APIVALE Blog Topic Selection Skill (SEO & Pain-Point Arbitrage Framework)

This document defines a reproducible, data-driven methodology ("Skill") to identify, validate, and structure high-converting blog topics for `apivale.com`. 

---

## 🎯 Skill Goal
To systematically discover and select blog topics that target high-intent developers, bypass heavy competition, resolve regional or payment friction points, and directly convert readers into APIVALE users.

## ⚙️ The Core Formula
$$\text{Competitor Traffic Audit (Similarweb)} \rightarrow \text{Keyword \& Content Gap Validation (Semrush/Google SERP)} \rightarrow \text{Friction Point Extraction} \rightarrow \text{Topic Output}$$

---

## 📋 Step-by-Step Execution Workflow

### Step 1: Competitor Traffic Audit (Similarweb)
Identify where competitors are getting their traffic. Look for API aggregation gateways, API resellers, proxy services, and regional API providers (e.g., `requesty.ai`, `piapi.ai`, `deepseekapi.io`).
- **Look for:** High-frequency search queries related to:
  - Custom API endpoints/endpoints modification (`cursor custom endpoint`, `openai base url`).
  - Access limits and quota exhaustion (Vibe coding/IDE auto-complete limits).
  - Alternatives to market leaders (`openrouter alternative`).
  - Emerging Chinese LLMs with high demand but overseas access barriers (`z.ai`, `deepseek`, `kling api`).

### Step 2: Keyword & Content Gap Validation (Semrush & Google SERP)
Audit search volume, Keyword Difficulty (KD), and competitor content depth:
- **Keyword Auditing**: Use Semrush to identify:
  - **High-Commercial Intent (CPC > $3.00)**: Focus on transactional/commercial queries even with low volume.
  - **Low Difficulty (KD < 40%)**: Target long-tail variations.
  - **Zero-Volume/Emerging Keywords**: Lock onto new model releases or domain migrations before tools update.
- **SERP Gap Analysis (Google Page 1)**:
  - Analyze the top 10 search results.
  - **Target Opportunity**: If search results are dominated by official homepages, API reference documentation, or raw GitHub repos (which lack step-by-step 3rd-party IDE integration guides, cost comparisons, or pricing tables), there is a **strong Content Gap**.

### Step 3: Developer Friction & Billing/Access Pain Point Extraction
Analyze where developers face friction. Connect the topic to APIVALE’s core business values:
1. **KYC / Real-Name Verification Limits**: Overseas developers lacking +86 phone numbers or Chinese identity verification for platforms like Zhipu (BigModel) or Tencent Hunyuan.
2. **Payment Obstacles**: Developers without local payment methods (Alipay/WeChat) trying to access Chinese APIs, or Chinese developers without international credit cards trying to access OpenAI/Claude.
3. **IDE Integration Complexity**: Official docs explaining raw HTTP/SDKs but lacking configuration for Cursor, Cline, Windsurf, or VS Code.
4. **Cost & Limit Arbitrage**: Calculating whether Cursor Pro ($20/mo) is more expensive than using custom endpoints with a pay-as-you-go proxy key (especially for power users who exhaust Pro limits).

### Step 4: Topic Proposal Construction & Formatting
For each selected topic, output a standardized specification containing:
1. **Title**: Catchy, SEO-optimized, CTR-driven (50-60 characters, keyword first).
2. **Target Keywords**: Standard/emerging terms with volume, KD, CPC.
3. **Developer Friction Point**: The specific problem being solved.
4. **APIVALE Value Proposition Hook**: Why they should sign up on APIVALE.
5. **Comparison Matrix Outline**: What pricing or feature comparison to display.
6. **Code Snippet Blueprints**: The exact languages and API calls to demonstrate.
7. **Developer FAQ Plan**: 3-4 highly direct questions for AI GEO (Generative Engine Optimization) indexing.

---

## 🛠️ Topic Selection Execution Template (Prompt for AI Agents)

When executing this skill, copy and paste the following prompt structure:

```markdown
You are the APIVALE SEO & Niche Topic Generator. Execute the Topic Selection Skill to find 3 high-converting blog ideas.

### INPUT DATA
1. Targeted Models / Trends: [e.g., DeepSeek-V4-Pro, Hunyuan-3D, Cline VS Code]
2. Competitor URLs: [e.g., api-reseller-x.com, deepseekapi.io]
3. Current APIVALE Strengths: [e.g., Paypal/Stripe support, no-KYC access, high concurrency]

### INSTRUCTIONS
Apply the 4-Step Formula:
1. Audit traffic angles (e.g. IDE endpoint custom config, billing alternatives).
2. Look for Content Gaps on Google SERP (where official docs lack IDE integration guides).
3. Extract developer pain points (KYC, +86 phone, PayPal/Stripe payment blocks).
4. Formulate 3 topics matching the output structure below.

### OUTPUT FORMAT (For each topic)
- **Topic Title**: [Title]
- **Target Slug**: `/blog/[slug-name]`
- **Target Keywords & Metrics**:
  - `primary keyword` (Vol: X, KD: X%, CPC: $X)
  - `secondary keyword` (Vol: Y, KD: Y%, CPC: $Y)
- **Target Persona**: [e.g. Cline Extension User, Indie Hacker]
- **Friction Point**: [Specific developer pain point]
- **APIVALE Conversion Hook**: [How APIVALE converts this visitor]
- **Key Modules**:
  1. Quick Start (cURL snippet)
  2. Comparison Table (Parameters)
  3. Step-by-Step IDE/SDK Config Guide
  4. FAQ Plan for GEO
```
