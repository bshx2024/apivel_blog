# Phased Implementation Plan - APIVALE Blog SEO Content Launch

This plan outlines the step-by-step release schedule to initialize the Sitemap routes, content files, and database integrations in the **APIVALE_blog** Astro project (`E:\kaifa\APIVALE_blog`) based on our verified Semrush metrics. 

To prevent Google's crawl budget overflow and spam penalties, the release is structured into **three progressive phases**, focusing on running through the traffic and payment conversion loop as quickly as possible.

---

## 📈 Phased Release Schedule (逐步开发与发布计划)

### 🚀 Phase 1: The Beachhead Loop (Week 1 - 冷启动与首个转化闭环)
*   **Goal**: Establish the first functional loop (technical help -> APIVALE registration -> payment conversion) using the lowest-KD developer paint-point keywords.
*   **Release Day**: Day 1
*   **Deliverables**:
    1.  **Layout Modifications**: Integrate canonical tags in `src/layouts/Layout.astro` (essential to prevent parameter duplication).
    2.  **Article 1 (Cursor setup)**: [how-to-use-z-ai-api-in-cursor-editor.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/how-to-use-z-ai-api-in-cursor-editor.md)
        *   *Primary Keywords*: `cursor api key` (KD 23%, CPC $8.07), `openai base url` (KD 38%, CPC $19.33).
        *   *Action*: Provide exact `.cursorrules` and endpoint configurations. Direct them to get a trial key on APIVALE.
    3.  **Article 2 (KYC Bypass)**: [bypass-zhipu-ai-real-name-verification.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/bypass-zhipu-ai-real-name-verification.md)
        *   *Primary Keywords*: `bypass zhipu verification`, `how to register on open.bigmodel.cn without phone`.
        *   *Action*: Explain the +86 restriction and offer APIVALE as the instant proxy key bypass.
*   **Validation**: Verify pages compile locally, submit URLs directly to Google Search Console for immediate indexing.

---

### 🚀 Phase 2: The Competitor Sniper (Week 2 - 竞品拦截与支付替换)
*   **Goal**: Hijack bottom-of-funnel traffic from users searching for alternatives to high-DA aggregators.
*   **Release Day**: Day 8 (1 week after Phase 1)
*   **Deliverables**:
    1.  **Article 3 (Aggregator comparison)**: [openrouter-alternatives.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/openrouter-alternatives.md)
        *   *Primary Keywords*: **`openrouter alternative` (KD 8%, CPC $3.35)**.
        *   *Action*: Detailed comparison grid of pricing, latency, and Stripe billing support, highlighting APIVALE's superiority for Asian LLMs.

---

### 🚀 Phase 3: The Scale & Defense Engine (Week 3 onwards - 规格池横向拓建与防御)
*   **Goal**: Fill the remaining content gaps (pricing pages) and protect brand search reputation.
*   **Release Day**: Day 15 onwards
*   **Deliverables**:
    1.  **Article 4 (Pricing comparison)**: [z-ai-vs-bigmodel-cn-pricing.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/z-ai-vs-bigmodel-cn-pricing.md)
        *   *Primary Keywords*: `z.ai pricing` (KD 36%, CPC $3.37).
    2.  **Defensive Review Page**: `apivale-reviews.md`
        *   *Primary Keywords*: `APIVALE reviews`, `APIVALE trustworthy`.
    3.  **Programmatic Model Leaderboard**: Slowly generate model comparison subpages in cohorts of 5 pages/week to respect the crawl budget.

---

## Proposed Changes (Phase 1 Focus)

### 📁 1. Layout & On-Page Configurations
#### [MODIFY] [Layout.astro](file:///E:/kaifa/APIVALE_blog/src/layouts/Layout.astro)
- Add dynamic canonical tag insertion using `Astro.url.pathname` to consolidate PageRank.

### 📁 2. New SEO Content Articles
#### [NEW] [how-to-use-z-ai-api-in-cursor-editor.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/how-to-use-z-ai-api-in-cursor-editor.md)
#### [NEW] [bypass-zhipu-ai-real-name-verification.md](file:///E:/kaifa/APIVALE_blog/src/content/blog/bypass-zhipu-ai-real-name-verification.md)

---

## Verification Plan
### Automated Tests
- Run `npm run build` locally in `E:\kaifa\APIVALE_blog` to ensure Astro generates the static HTML pages successfully without errors.
- Run a local dev server (`npm run dev`) and inspect the generated source code of `/blog/openrouter-alternatives/` to confirm that canonical tags are present and the layout renders properly.

### Manual Verification
- Confirm that the new markdown files are recognized by Astro and served at `http://localhost:4321/blog/how-to-use-z-ai-api-in-cursor-editor/`.
- Verify that all code blocks (cURL, JSON, Python) are copy-pasteable and render with Shiki syntax highlighting.