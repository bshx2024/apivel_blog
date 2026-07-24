## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Standard Operating Procedure (SOP) for SEO Blog Creation

Before writing any new blog post for APIVALE, you **MUST** follow this 4-step workflow:

### Step 1: Target Keyword Selection & Plan Lookup
- Consult [KEYWORD_PLAN.md](file:///f:/旅行携带资料/kaifa/APIVALE_blog/KEYWORD_PLAN.md) to pick the next approved article topic and target keyword clusters.

### Step 2: SERP Competitor Retrieval & Audit (Top 5 Pages)
- Perform a live Google/Search query for the target keyword.
- Identify the Top 5 ranking competitor pages.
- Use `read_url_content` (or CodexLink bridge) to **fetch and read the full text/HTML of the Top 5 pages one by one**.
- **Search Intent 3C Diagnosis (搜索意图 3C 诊断)**:
  - **Content Type**: Confirm predominant page type (Blog post, Landing page, Documentation).
  - **Content Format**: Identify predominant format (How-To Tutorial, Listicle, Comparison Review, Guide). Article MUST align with the dominant format!
  - **Content Angle**: Identify top ranking hooks (e.g., *"2026 Latest"*, *"Zero Credit Card"*) and define APIVALE's winning angle (*"PayPal Billing + Multi-Gateway Fallback"*).
- **Sub-heading & Content Gap Extraction (共性小标题与内容缝隙提取)**:
  - Extract common H2/H3 sub-topics shared across Top 5 competitor pages to guarantee 100% search intent coverage.
  - Identify missing sub-topics and technical blindspots (Content Gap) to form APIVALE's unique sub-sections.

### Step 3: Outranking Strategy & 3-Tier Keyword Architecture
Formulate a comprehensive outranking plan:
- **Tier 1 (Primary Target)**: Main keyword in Title, H1, and first 100 words.
- **Tier 2 (LSI & Intent Clusters)**: Long-tail semantic keywords anchored in H2/H3 headings.
- **Tier 3 (Brand & Alternative Clusters)**: Competitor names, model names, and APIVALE features.
- **PAS Intro Formula (PAS 引言公式)**:
  - First 100 words MUST use **P**roblem (hook problem) -> **A**gitate (amplify developer pain) -> **S**olve (introduce solution with APIVALE).
- **E-E-A-T Credibility Anchor (E-E-A-T 权威与信任锚点)**:
  - Establish APIVALE's engineering authority in the intro (e.g., *"Based on empirical stress-tests across 10,000+ API agent loops on APIVALE's production gateway..."*).
- **Open Loops & Teasers (开环悬念)**:
  - Tease upcoming key benchmark findings or 15+ line production scripts early in the intro to drive scroll depth and retention.
- **Inverted Pyramid Outline Structure (倒金字塔大纲结构)**:
  - Place the most critical, search-intent-satisfying answers (definitions, core setup steps, key comparison table) at the top of the article.
  - Expand into secondary topics, advanced edge cases, and deep-dive technical nuances later in the document.
- **Featured Snippet Optimization (精选摘要优化段落)**:
  - Under primary H2/H3 headings, provide a 40-50 word concise direct definition or ordered step-by-step list to capture Google's Position Zero (Featured Snippet).
- **Mandatory "4 Ones" Information Gain Checklist (独特性 4 个 1 规范)**:
  To avoid copycat content and maximize Google Information Gain score, every article MUST include:
  1. **1 Branded Methodology / Named Formula (1个独家提炼的方法论/命名公式)**: Synthesize a proprietary named framework or methodology (e.g., *"The 3-Tier Token Thinning Matrix"*).
  2. **1 Set of Real Benchmark / Calculated Data (1组真实工程实测/成本推算数据)**: Include empirical TTFT/latency/token test data (run via AI background script) or deterministic scenario mathematical calculations.
  3. **1 Edge-Case & Hidden Trap Solution (1个竞品未触及的高级踩坑解决方案)**: Solve an overlooked technical blindspot that Top 5 SERP competitors missed (e.g., proxy header conflicts, stream buffering drops, context pruning drops).
  4. **1 Production-Grade Code / Config Snippet (1个生产级工程代码/配置文件)**: Provide a 15+ line copy-pasteable script or configuration with complete error handling and retry logic.
- **Show, Don't Tell Rule (展示演示，不要空谈)**:
  - Every technical recommendation MUST be accompanied by concrete proof: a copy-pasteable configuration file, exact CLI command, terminal log snippet, or Mermaid flowchart.
- **Outranking Elements**: Include a 15-line copy-pasteable code snippet, token math cost comparison, comparison matrix table, and structured FAQ (`JSON-LD`).

### Step 4: Drafting & Compliance Verification
- Write the article in `src/content/blog/<article-slug>.md`.
- **AI Peer Review Loop (AI 同行自审机制)**: Act as a senior DevOps reviewer to check for logic gaps, broken code, ungrounded claims, and robotic phrasing before committing.
- Verify strict compliance with the **Blog Writing Standards & Guidelines** below.
- Compile and test the dev server (`http://localhost:4321/blog/...`), commit, and push to remote git repository.

---

## Blog Writing Standards & Guidelines

- **Search Intent & 3C Compliance**:
  - **MANDATORY**: Content MUST match user search intent by satisfying the 3C framework (Content Type, Content Format, Content Angle) identified in Step 2.
  - **100% Sub-topic Coverage**: Article structure MUST cover all common H2/H3 sub-topics expected by users based on Top 5 competitor audit before adding unique Information Gain elements.
- **Information Gain & Uniqueness (Google Link Information Gain Patent Compliance)**:
  - **MANDATORY**: Do NOT produce copycat content that merely rehashes Top 5 SERP competitors. Every article MUST satisfy the **"4 Ones" Information Gain Checklist"** defined in Step 3.
  - **Zero-Manual Benchmark Execution**: Empirical test data must be generated either by AI running benchmark scripts via terminal (`run_command`) or via deterministic mathematical scenario models. No manual testing is required from the human developer.
  - **Share Triggers & Citeable Assets (引用与分享触发器)**: Format named formulas and benchmark data into clear, citeable cards/tables so other tech writers and developers feel compelled to link back to APIVALE.
- **ASMR Readability & Layout Standard (ASMR 易读性排版标准)**:
  - **A (Annotation)**: Use GitHub-style Alert boxes (`> [!NOTE]`, `> [!TIP]`) and blockquotes to break layout monotony.
  - **S (Short)**: Keep sentences crisp and paragraphs short (2-3 lines max); trim filler words.
  - **M (Multimedia)**: Include Mermaid flowcharts, code blocks, or log callouts to visualize complex logic.
  - **R (Readability)**: Ensure natural human-like flow without robotic stiffness.
- **Developer Jargon & LSI Entity Indexing (开发者行话与实体语义)**:
  - **MANDATORY**: Use authentic developer terminology (`TTFT`, `Context Pruning`, `Exponential Backoff`, `SSE Stream Buffering`, `Header Injection`). This builds instant developer trust and signals high topical authority to Google's entity indexing.
- **Funnel-Aligned CTA Strategy (基于营销漏斗匹配的 CTA)**:
  - **Informational Articles**: CTA should point to related deep-dive articles or interactive calculators to move users down the funnel.
  - **Commercial / Decision Articles**: Direct CTA for APIVALE **PayPal Global Billing** and API key creation cards.
- **Evergreen Short URL Slug Policy (常青简短 URL 命名)**:
  - URL Slugs MUST be concise, directly include the primary target keyword, and **NEVER contain years/dates or volatile numbers** (e.g., use `/blog/qwen-3-7-max-claude-code-setup` NOT `/blog/2026-qwen-3-7-max-claude-code-setup`) to allow seamless long-term updates without 301 redirects.
- **CTR-Optimized Title Formulation (高点击率标题公式)**:
  - Title Tag MUST use the formula: `[Primary Keyword] + [Modifier/Number/Year] + [APIVALE Unique Hook]` (e.g., *"How to Connect Qwen 3.8 to Claude Code (2026 Guide + PayPal Billing)"*).
- **Contextual Internal Linking Policy (上下文内链规范)**:
  - Every article MUST contain **at least 2-3 contextual internal links** pointing to relevant published APIVALE blog posts to transfer page equity and reduce bounce rate.
- **Supported Payment Method**: APIVALE currently supports **PayPal** (global PayPal billing / credit cards via PayPal) as its primary payment method. 
  - **MANDATORY**: Do NOT state or market Stripe or Cryptocurrency as supported payment methods for APIVALE. Always reference **PayPal** / **PayPal Global Billing** in CTA cards, blog posts, and site metadata.
- **Model Recency**: Always reference the latest flagship LLM versions when making benchmarks or comparisons (e.g., **Claude Sonnet 5** for Anthropic, **Qwen 3.7 Max** for Alibaba, **DeepSeek V4** for DeepSeek).
  - Note: In APIVALE, Qwen 3.7 Max invocation model name is `infer/qwen3.7-max`.
- **SEO & UTM Parameters**: Ensure all CTA links contain `utm_source=apivale_blog&utm_medium=blog&utm_campaign=<article-slug>`.
- **Protocol Compatibility**: Emphasize APIVALE's native OpenAI and Anthropic API protocol endpoint support for tools like Claude Code CLI, Cursor, and Windsurf.

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
