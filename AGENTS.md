## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project-Scoped Customizations & Skills (Zero Global Pollution Rule)

All skills, toolchains, and custom workflows tailored for APIVALE (such as `apivale-blog-publishing` and `apivale-comment-outreach`) **MUST be placed strictly inside the project-scoped directory**:
👉 **`.agent/skills/<skill-name>/SKILL.md`**

**Strict Isolation Rules**:
- **Zero Global Leakage**: NEVER write project-specific skills, personas, or workflows to the machine-level global directory (`~/.gemini/config/skills/` or `C:\Users\Administrator\.gemini\config\skills\`). Global skills are auto-injected into *every* conversation across *all* projects on the machine, contaminating unrelated workspaces.
- **Git Version Control**: All project skills must be committed under `.agent/skills/` so they are project-scoped, team-shareable, and version-controlled.
- **Local Toolchain Execution**: Run audit scripts directly from the workspace: `node .agent/skills/apivale-blog-publishing/scripts/audit_article.cjs <file>`.

## Standard Operating Procedure (SOP) for SEO Blog Creation

Before writing or editing any blog post for APIVALE, you **MUST** consult and adhere to the Master Blog Writing & SEO/GEO Standard:
👉 **[BLOG_WRITING_STANDARD.md](file:///e:/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md)**

Follow this 4-step execution workflow:

### Step 1: Target Keyword Selection & Plan Lookup
- Consult [KEYWORD_PLAN.md](file:///e:/kaifa/APIVALE_blog/KEYWORD_PLAN.md) and [SEO_KEYWORD_MATRIX.md](file:///e:/kaifa/APIVALE_blog/SEO_KEYWORD_MATRIX.md) to pick the next approved article topic.
- Perform Parent Topic & Secondary LSI Audit as defined in [BLOG_WRITING_STANDARD.md](file:///e:/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md).

### Step 2: SERP Competitor Retrieval, 3C Audit & Primary-Source Mining
- **Dual-Track SERP Intent Ingestion Protocol (P0)**:
  - **Track A (Pure-Keyword Autonomous Harvester)**: When the user provides **only the core keyword** (no screenshots attached, e.g. `glm 5.4 vs 5.3`), the agent **MUST autonomously run** `bun .agent/skills/apivale-blog-publishing/scripts/fetch_serp_intent.cjs "<keyword>"` (`BypassSandbox: true`) and use `search_web` to harvest Google autocomplete suggestions (without trailing space, with trailing space, related variants like `flash`), detect entity collisions (e.g. `gmc 5.4`), and extract Google PAA 4 questions.
  - **Track B (Zero-Omission Screenshot Ingestion)**: Whenever screenshots/images are attached in the conversation, the agent **MUST inspect all attached images first**, extract all dropdown suggestions (absorbing high-intent variants like `flash` into Title/Description/H2, enforcing AI entity disambiguation against non-tech collisions like `gmc 5.4 vs 6.2`), and 1:1 verbatim copy the 4 PAA questions into FAQ & FAQPage schema.
  - **Mandatory Upfront Intent Output**: **Never start drafting before outputting the structured SERP intent mapping matrix** at the very beginning of the response.
- Perform a live search query for the target keyword and identify the Top 5 ranking pages.
- Use `read_url_content` to fetch and read the Top 5 pages one by one.
- Conduct **Search Intent 3C Diagnosis** (Content Type, Format, Angle) & extract common H2/H3 sub-topics and Content Gap.
- Mine 1 verified **Primary-Source Community Voice** (real GitHub Issue or Reddit post with verbatim quote, live URL, and author; fall back to official RFC/telemetry if not found).

### Step 3: Outranking Strategy, Honesty Architecture & "4 Real Engineering Gains"
- Formulate a 3-Tier Keyword Architecture (Tier 1 Title/H1/Intro, Tier 2 H2/H3 LSI, Tier 3 Brand/Features).
- Apply **Context-Specific Technical Hook** combined with real community voice (ban repetitive boilerplate intros).
- Ensure strict compliance with the **"4 Real Engineering Gains" Checklist** (Verifiable Protocol Architecture Proof, Real Benchmark/Math Data with Write-Time Verification & Objective Competitor "Best for..." Column, Verifiable Community Voice & Edge-Case Troubleshooting, 15+ line Production Code/Config).
- Formulate Title Tag using **ABC Title Formula** (`[Adjective/Primary Keyword] + [Benefit / Secondary LSI] | [APIVEL Hook]`) within **50–60 characters (max 600px)** and append `| APIVEL` (aligned with `apivel.com` brand identity).

### Step 4: Drafting, Pre-Flight Audit & Atomic Bidirectional Publishing

When executing Step 4, Reed and coding assistants **MUST execute the following 5-Gate Atomic Protocol** in a single complete transaction (never leave partial work):

1. **Gate 1 (Drafting, Community Voice, Live Playground & CRO Alignment)**:
   - Write article in `src/content/blog/<article-slug>.md` with strict AST symmetry (1 H1 <= 80 chars, symmetrical H2 $\rightarrow$ H3, no H4 jumping, **widgets must use `<div>` instead of `<h1>`-`<h4>`**).
   - Configure frontmatter `keyTakeaways` array with 4 explicit technical parameters matching user search intent (protocol, target model ID, baseURL, `PayPal & Global Cards ($0.20 Trial)`).
   - Inject the **4 Real Engineering Gains** + embedded **Community Voice Box** + **Objective Comparison Table** + embedded **In-Article Live Playground / Interactive Micro-Tool** (with interactive `<input>`/`<select>`/`<button>` to fulfill on-page intent and eliminate 4.5 pt doorway page deduction) + **FAQ JSON-LD Schema**.
   - Inject **Ending CTA Card (`.cta-card`) aligned with wallet**: +50% first deposit bonus ($5 $\rightarrow$ $7.50, $29 $\rightarrow$ $43.50), $29 developer pack (56% OFF, 40M tokens, never expires), $0.20 free signup trial, dual action buttons: primary `https://apivel.com/sign-up?preset=<model>&redirect=%2Fdashboard%3Fquickstart%3Dtrue&from_blog=<slug>` and secondary `https://apivel.com/pricing?from_blog=<slug>`.
   - Register new model topics in `src/pages/[slug].astro` (`TOPIC_CONFIG`) with bilingual metadata.
   - Enforce **Zero-Circular-Redirect Rule**: NEVER use `redirect=/blog/<slug>` or `redirect=%2Fblog...` in CTA links (prevents post-auth loop back to the blog post). Always track attribution with `from_blog=<slug>` and route sign-up to `%2Fdashboard%3Fquickstart%3Dtrue`.
   - Enforce **H2 Anchor Structure Rule**: Every article must include at least 3 clear `## ` H2 headings for AST clarity and in-content bridge compatibility.
   - Enforce **Zero-Alert Rule**: code blocks rely on automated 1-Click Copy UI; NEVER hand-craft native `alert()` popups in markdown.
   - Enforce **Decimal Model Version Space Rule (P0)**: Write decimal model versions with spaces in Title/H1 (e.g. `GLM 5.4 vs 5.3`, NOT `GLM-5.4`) to prevent tokenizer decimal-stripping traps and ensure 100% URL keyword coverage.
2. **Gate 2 (Automated Pre-Flight SEO Health & Link Audit)**:
   - Run `audit_article_seo_health` against the new slug.
   - Enforce: 0 blockers, 0 warnings, MetaTitle in 50–60 chars (max 600px), H1 <= 80 chars, Meta Description in 140–160 chars, visible word count strictly in 1350–1550 words (pure body) to ensure total rendered page <= 2200 tokens (prevent >1800 word deduction), all external URLs probe HTTP 200, PayPal official instant checkout & global zero-FX billing strictly enforced.
3. **Gate 3 (Atomic Bidirectional Mesh Weaving - MUST MODIFY OLD POSTS)**:
   - Search the repository for 2–3 existing high-authority pillar articles in the same or adjacent topic cluster.
   - **Immediately open and edit those existing articles** to inject contextual inbound anchor links and Mermaid failover nodes pointing to the new article.
   - *Rule*: Never publish a new post as an orphan. Outbound and inbound links MUST be committed together.
4. **Gate 4 (Action Log Auto-Archive)**:
   - Append the standardized entry to [SEO_ACTION_LOG.md](file:///e:/kaifa/APIVALE_blog/SEO_ACTION_LOG.md) documenting target URL, keywords, exact technical changes, and 14-day causality hypothesis.
5. **Gate 5 (Atomic Commit, Push & Live Status Verification)**:
   - Stage all modified files (new article + updated old articles + action log) in a single Git commit and push to `origin main` (`BypassSandbox: true` on Windows).
   - Verify deployment build completion, actively probe and confirm live `HTTP 200` response on `https://apivel.com/blog/<slug>/`, and **explicitly provide the live canonical URL (`https://apivel.com/blog/<slug>/`) + recommended Page Coach (哥飞页面军师) keyword(s)** directly in your final response without waiting for the user to ask.

---

## Critical Compliance Rules (Quick Checklist)

- **Master Reference**: Always refer to [BLOG_WRITING_STANDARD.md](file:///e:/kaifa/APIVALE_blog/BLOG_WRITING_STANDARD.md) for full detailed specifications (Personas, Featured Snippet components, WebP media rules, Mobile-first UX).
- **Anti-Spam & Anti-Boilerplate**: NEVER use copy-pasted introductory templates (e.g. `Running autonomous AI coding agents... burns $40...`). NEVER invent fake branded formulas (`Matrix/Triangle`).
- **Answer-First & Zero Pogo-Sticking**: Provide structured `keyTakeaways` in frontmatter for instant 1-second answers. NEVER trigger invasive modal popups before 25s or 35% scroll depth.
- **Supported Payment Method**: APIVALE officially supports **PayPal** (PayPal Instant Checkout / Pay with PayPal) as mainstream, plus international credit cards (Visa, MasterCard, Amex), Apple Pay, and Alipay via global billing gateway (0 extra FX fees, zero KYC). NEVER reference Stripe or Crypto.
- **In-Article Live Playground**: Always embed an interactive playground/tester with `<input>`/`<select>`/`<button>` to fulfill search intent and prevent P0 4.5 pt doorway bounce penalty.
- **Wallet Benefits Alignment**: Ending `.cta-card` must 100% match wallet offers: +50% first deposit bonus ($5 $\rightarrow$ $7.50), $29 developer pack (56% OFF, 40M tokens), $0.20 free signup trial, dual `/sign-up` (with `redirect=%2Fdashboard%3Fquickstart%3Dtrue&from_blog=<slug>`) and `/pricing` (with `from_blog=<slug>`) links.
- **HTML Widget AST Cleanliness**: NEVER use `<h1>`-`<h4>` inside embedded HTML widgets (Definition Box, Key Takeaways, CTA, Playground). Always use `<div>` or `<span>` with CSS classes to maintain a single H1 $\rightarrow$ H2 $\rightarrow$ H3 tree.
- **Word Count & Metrics**: Keep visible words between 1200–1800 words (prevent theme dilution); MetaTitle 50–60 chars (max 600px); H1 <= 80 chars; Meta Description 140–160 chars; at least 3 clear `## ` H2 headings.
- **Model Recency**: Reference flagship LLM versions (**Claude Sonnet 5**, **Qwen 3.7 Max**, **DeepSeek V4**, **Xiaomi MiMo-V2.6 Pro**). Invocation model name for Qwen 3.7 Max is `infer/qwen3.7-max`, MiMo-V2.6 Pro is `infer/xiaomi-mimo-v2.6-pro`.
- **Evergreen Short Slugs**: Slugs must be concise without years/dates (e.g., `/blog/qwen-3-7-max-claude-code-setup`).
- **Protocol Compatibility**: Emphasize native OpenAI and Anthropic endpoint support for Claude Code CLI, Cursor, Windsurf.
- **Zero-Circular-Redirect Rule**: NEVER use `redirect=/blog/<slug>` in CTA links (causes post-login redirect loops); use `redirect=%2Fdashboard%3Fquickstart%3Dtrue&from_blog=<slug>` on `/sign-up` and `from_blog=<slug>` on `/pricing`. Run `bun scripts/check-no-circular.cjs` before commit.
- **Zero-Alert UX**: Never write `onclick="...alert(...)"`. Code copy buttons must use smooth in-place state transitions.

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
