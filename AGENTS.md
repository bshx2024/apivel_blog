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
- Analyze each competitor's strengths, weaknesses, technical gaps, and content flaws.

### Step 3: Outranking Strategy & 3-Tier Keyword Architecture
Formulate a comprehensive outranking plan:
- **Tier 1 (Primary Target)**: Main keyword in Title, H1, and first 100 words.
- **Tier 2 (LSI & Intent Clusters)**: Long-tail semantic keywords anchored in H2/H3 headings.
- **Tier 3 (Brand & Alternative Clusters)**: Competitor names, model names, and APIVALE features.
- **Outranking Elements**: Include a 15-line copy-pasteable code snippet, token math cost comparison, comparison matrix table, and structured FAQ (`JSON-LD`).

### Step 4: Drafting & Compliance Verification
- Write the article in `src/content/blog/<article-slug>.md`.
- Verify strict compliance with the **Blog Writing Standards & Guidelines** below.
- Compile and test the dev server (`http://localhost:4321/blog/...`), commit, and push to remote git repository.

---

## Blog Writing Standards & Guidelines

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
