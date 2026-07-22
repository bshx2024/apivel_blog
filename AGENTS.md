## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Blog Writing Standards & Guidelines

- **Supported Payment Method**: APIVALE currently supports **PayPal** (global PayPal billing / credit cards via PayPal) as its primary payment method. 
  - **MANDATORY**: Do NOT state or market Stripe or Cryptocurrency as supported payment methods for APIVALE. Always reference **PayPal** / **PayPal Global Billing** in CTA cards, blog posts, and site metadata.
- **Model Recency**: Always reference the latest flagship LLM versions when making benchmarks or comparisons (e.g., **Claude Sonnet 5** for Anthropic, **Qwen 3.7 Max** for Alibaba, **DeepSeek V4** for DeepSeek).
- **SEO & UTM Parameters**: Ensure all CTA links contain `utm_source=apivale_blog&utm_medium=blog&utm_campaign=<article-slug>`.
- **Protocol Compatibility**: Emphasize APIVALE's native OpenAI and Anthropic API protocol endpoint support for tools like Claude Code CLI, Cursor, and Windsurf.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
