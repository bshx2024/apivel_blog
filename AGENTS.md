## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Standard Operating Procedure (SOP) for SEO Blog Creation

Before writing or editing any blog post for APIVALE, you **MUST** consult and adhere to the Master Blog Writing & SEO/GEO Standard:
👉 **[BLOG_WRITING_STANDARD.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md)**

Follow this 4-step execution workflow:

### Step 1: Target Keyword Selection & Plan Lookup
- Consult [KEYWORD_PLAN.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/KEYWORD_PLAN.md) and [SEO_KEYWORD_MATRIX.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/SEO_KEYWORD_MATRIX.md) to pick the next approved article topic.
- Perform Parent Topic & Secondary LSI Audit as defined in [BLOG_WRITING_STANDARD.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md).

### Step 2: SERP Competitor Retrieval & Audit (Top 5 Pages)
- Perform a live search query for the target keyword and identify the Top 5 ranking pages.
- Use `read_url_content` to fetch and read the Top 5 pages one by one.
- Conduct **Search Intent 3C Diagnosis** (Content Type, Format, Angle) & extract common H2/H3 sub-topics and Content Gap.

### Step 3: Outranking Strategy & "4 Ones" Architecture
- Formulate a 3-Tier Keyword Architecture (Tier 1 Title/H1/Intro, Tier 2 H2/H3 LSI, Tier 3 Brand/Features).
- Apply **PAS Intro Formula**, **E-E-A-T Credibility Anchor**, and **Inverted Pyramid Outline**.
- Ensure strict compliance with the **Mandatory "4 Ones" Information Gain Checklist** (Branded Methodology, Real Benchmark/Math Data, Edge-Case Solution, 15+ line Production Code/Config).
- Formulate Title Tag using **ABC Title Formula** (`[Adjective/Primary Keyword] + [Benefit / Secondary LSI] | [APIVALE Hook]`) within **50–60 characters (max 600px)** and append `| APIVALE`.

### Step 4: Drafting, Compliance & Action Logging
- Write article in `src/content/blog/<article-slug>.md`.
- Run **AI Peer Review Loop** as a senior DevOps reviewer to check code validity, logic, and phrasing.
- Verify full compliance with [BLOG_WRITING_STANDARD.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md).
- Log the optimization entry in [SEO_ACTION_LOG.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/SEO_ACTION_LOG.md) (16:59 Daily Ritual).
- Compile and test on dev server (`http://localhost:4321/blog/...`), then commit and push.

---

## Critical Compliance Rules (Quick Checklist)

- **Master Reference**: Always refer to [BLOG_WRITING_STANDARD.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md) for full detailed specifications (Personas, Featured Snippet components, WebP media rules, Mobile-first UX).
- **Supported Payment Method**: APIVALE strictly supports **PayPal** (PayPal Global Billing / Credit Cards via PayPal). NEVER reference Stripe or Crypto.
- **Model Recency**: Reference flagship LLM versions (**Claude Sonnet 5**, **Qwen 3.7 Max**, **DeepSeek V4**). Invocation model name for Qwen 3.7 Max is `infer/qwen3.7-max`.
- **Evergreen Short Slugs**: Slugs must be concise without years/dates (e.g., `/blog/qwen-3-7-max-claude-code-setup`).
- **Protocol Compatibility**: Emphasize native OpenAI and Anthropic endpoint support for Claude Code CLI, Cursor, Windsurf.

---

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
