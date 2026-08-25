import fs from "fs";
import path from "path";
import { BLOG_DIR, DRAFTS_DIR, KEYWORD_PLAN_PATH } from "../utils/config";
import {
  BlogMetadata,
  getAllPublishedPosts,
  parseBlogPost,
  writeBlogPostFile
} from "../utils/frontmatter";
import { calculateTopicOverlap } from "../utils/similarity";

export interface PrePublishAuditResult {
  passed: boolean;
  blockers: string[];
  warnings: string[];
  metaTitleLength: number;
  wordCount: number;
}

export function runAntiSpamAudit(
  metaTitle: string,
  content: string,
  description?: string
): PrePublishAuditResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // 1. Check Meta Title length (Ideal: 50-60 characters, max 60 to prevent SERP truncation)
  const titleLen = (metaTitle || "").length;
  if (titleLen > 60) {
    blockers.push(`metaTitle is too long (${titleLen} chars). Maximum allowed is 60 chars (58 chars optimal) to prevent Google SERP '...' truncation.`);
  } else if (titleLen < 45) {
    warnings.push(`metaTitle is short (${titleLen} chars). Recommended range: 50-60 chars for maximum CTR.`);
  }

  // 2. Check Meta Description length (Ideal: 150-160 characters, proven 153 chars sweet spot)
  if (description) {
    const descLen = description.length;
    if (descLen > 165) {
      warnings.push(`metaDescription is long (${descLen} chars). Recommended range is 150-160 chars (153 chars sweet spot) to avoid SERP snippet truncation.`);
    } else if (descLen < 130) {
      warnings.push(`metaDescription is short (${descLen} chars). Enrich it to 150-160 chars with target keywords, model names, and PayPal checkout callout.`);
    }
  }

  // 2. Check for banned boilerplate intro templates
  if (/Running autonomous AI coding agents.*(?:burns \$40|burns credits rapidly)/i.test(content)) {
    blockers.push("Detected banned PAS boilerplate opening ('Running autonomous AI coding agents...'). Intro must start with model-specific architecture, context length, or concrete status codes.");
  }

  // 3. Check for banned synthetic formulas
  if (/The \d+-Tier .* (?:Matrix|Triangle|Framework)/i.test(content)) {
    blockers.push("Detected synthetic branded buzzword (e.g. 'The 3-Tier Matrix/Triangle'). Replace with genuine engineering terms like 'Multi-Model Fallback Architecture' or '3-Stage Token Optimization'.");
  }

  // 4. Check for production code blocks (15+ lines)
  const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
  let maxCodeLines = 0;
  for (const block of codeBlockMatches) {
    const lines = block.split("\n").length;
    if (lines > maxCodeLines) maxCodeLines = lines;
  }

  if (codeBlockMatches.length === 0) {
    blockers.push("Article contains zero code blocks. Must include at least 1 runnable configuration / code snippet.");
  } else if (maxCodeLines < 10) {
    warnings.push(`Longest code block is ${maxCodeLines} lines. Recommended to provide 15+ lines of production code with error handling.`);
  }

  // 5. Check for FAQ Schema or FAQ section
  if (!content.includes("### FAQ") && !content.includes("## Frequently Asked Questions")) {
    warnings.push("No explicit FAQ section found. Including a 3-question FAQ section enhances Position Zero / PAA ranking.");
  }

  // 6. CRO Conversion Optimization Audit
  if (!content.includes("Key Takeaways") && !content.includes("border-emerald-500")) {
    warnings.push("Missing Above-the-Fold Key Takeaways box. Adding a green key takeaways box with a direct free trial link boosts CRO by ~35%.");
  }

  if (!content.includes("PayPal") && !content.includes("paypal")) {
    warnings.push("Missing PayPal global billing mention. Clarifying zero-KYC PayPal payment removes international checkout friction.");
  }

  if (!content.includes("$0.20") && !content.includes("free starter credit") && !content.includes("sign-up")) {
    warnings.push("Missing explicit $0.20 free starter credit incentive callout.");
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount < 800) {
    warnings.push(`Word count is ${wordCount}. Recommended depth for technical guides is 1200-2200 words.`);
  }

  return {
    passed: blockers.length === 0,
    blockers,
    warnings,
    metaTitleLength: titleLen,
    wordCount
  };
}

export function handleDraftForReview(
  slug: string,
  frontmatter: BlogMetadata,
  markdownBody: string
): {
  draftPath: string;
  slug: string;
  auditResult: PrePublishAuditResult;
  reviewMessage: string;
} {
  const audit = runAntiSpamAudit(
    frontmatter.metaTitle || frontmatter.title,
    markdownBody,
    frontmatter.description
  );

  const filePath = writeBlogPostFile(DRAFTS_DIR, slug, frontmatter, markdownBody);

  return {
    draftPath: filePath,
    slug,
    auditResult: audit,
    reviewMessage: audit.passed
      ? `✅ Draft saved successfully at src/content/drafts/${slug}.md with 0 blockers. Ready for user review and approval.`
      : `⚠️ Draft saved with ${audit.blockers.length} blocker(s). Please resolve blockers before calling approve_and_publish.`
  };
}

export function handleApproveAndPublish(
  slug: string,
  frontmatter?: BlogMetadata,
  markdownBody?: string
): {
  publishedPath: string;
  slug: string;
  status: "published" | "blocked";
  auditResult: PrePublishAuditResult;
  message: string;
} {
  let postFrontmatter = frontmatter;
  let postBody = markdownBody;
  const draftFile = path.join(DRAFTS_DIR, `${slug}.md`);

  if (!postFrontmatter || !postBody) {
    if (fs.existsSync(draftFile)) {
      const parsed = parseBlogPost(draftFile);
      postFrontmatter = parsed.frontmatter;
      postBody = parsed.content;
    } else {
      throw new Error(`Draft file for '${slug}' not found in ${DRAFTS_DIR}, and no content was provided.`);
    }
  }

  const audit = runAntiSpamAudit(
    postFrontmatter.metaTitle || postFrontmatter.title,
    postBody,
    postFrontmatter.description
  );

  if (!audit.passed) {
    return {
      publishedPath: "",
      slug,
      status: "blocked",
      auditResult: audit,
      message: `❌ Publishing blocked due to SpamBrain / SEO compliance errors:\n- ${audit.blockers.join("\n- ")}`
    };
  }

  // Write to src/content/blog/
  const publishedPath = writeBlogPostFile(BLOG_DIR, slug, postFrontmatter, postBody);

  // Clean up draft file if it existed
  if (fs.existsSync(draftFile)) {
    fs.unlinkSync(draftFile);
  }

  // Update KEYWORD_PLAN.md status if this topic was planned
  if (fs.existsSync(KEYWORD_PLAN_PATH)) {
    let planText = fs.readFileSync(KEYWORD_PLAN_PATH, "utf-8");
    const titleRegex = new RegExp(`(\\|\\s*\\*?${postFrontmatter.title.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\*?\\s*\\|[\\s\\S]*?\\|\\s*)(?:⏳\\s*\\*\\*Planned(?:\\s*\\(Next\\))?\\*\\*)([\\s\\S]*?\\|)`, "i");
    if (titleRegex.test(planText)) {
      planText = planText.replace(titleRegex, `$1✅ **Published**$2`);
      fs.writeFileSync(KEYWORD_PLAN_PATH, planText, "utf-8");
    }
  }

  return {
    publishedPath,
    slug,
    status: "published",
    auditResult: audit,
    message: `🚀 Article successfully published to src/content/blog/${slug}.md! Anti-spam checks passed.`
  };
}

export function handleCheckKeywordCannibalization(
  targetKeywords: string[],
  proposedTitle: string
): {
  isSafeToPublish: boolean;
  highestOverlapScore: number;
  conflictingArticles: Array<{
    slug: string;
    title: string;
    overlapScore: number;
    matchedTerms: string[];
    recommendation: string;
  }>;
} {
  const published = getAllPublishedPosts();
  const conflicts: Array<{
    slug: string;
    title: string;
    overlapScore: number;
    matchedTerms: string[];
    recommendation: string;
  }> = [];

  let highestScore = 0;

  for (const post of published) {
    const { score, matchedTerms } = calculateTopicOverlap(
      targetKeywords,
      post.frontmatter.title || "",
      post.frontmatter.tags || [],
      post.headings
    );

    if (score > highestScore) highestScore = score;

    if (score >= 0.45) {
      conflicts.push({
        slug: post.slug,
        title: post.frontmatter.title,
        overlapScore: Math.round(score * 100) / 100,
        matchedTerms,
        recommendation:
          score >= 0.7
            ? `Severe cannibalization risk! Merge new content into /blog/${post.slug} as a new H2 section instead of creating a new URL.`
            : `Moderate topic overlap. Ensure new article differentiates its angle (e.g. CLI vs Cursor, or Benchmark vs Setup).`
      });
    }
  }

  conflicts.sort((a, b) => b.overlapScore - a.overlapScore);

  return {
    isSafeToPublish: highestScore < 0.7,
    highestOverlapScore: Math.round(highestScore * 100) / 100,
    conflictingArticles: conflicts
  };
}

export function handleAuditArticleSeoHealth(slug: string): {
  slug: string;
  exists: boolean;
  frontmatter?: BlogMetadata;
  auditResult?: PrePublishAuditResult;
  headings?: string[];
  internalLinksFound?: string[];
} {
  const targetFile = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(targetFile)) {
    return { slug, exists: false };
  }

  const post = parseBlogPost(targetFile);
  const audit = runAntiSpamAudit(
    post.frontmatter.metaTitle || post.frontmatter.title,
    post.content,
    post.frontmatter.description
  );

  // Extract internal links like /blog/...
  const internalLinkRegex = /\[([^\]]+)\]\((?:\/blog\/|https:\/\/apivale\.com\/blog\/)([^)]+)\)/g;
  const linksFound: string[] = [];
  let m;
  while ((m = internalLinkRegex.exec(post.content)) !== null) {
    linksFound.push(`/blog/${m[2]}`);
  }

  return {
    slug,
    exists: true,
    frontmatter: post.frontmatter,
    auditResult: audit,
    headings: post.headings,
    internalLinksFound: linksFound
  };
}

export function handleRefreshArticleMetadata(
  slug: string,
  updates: {
    metaTitle?: string;
    description?: string;
    tags?: string[];
    dateModified?: string;
  },
  textReplacements?: Array<{ search: string; replace: string }>
): {
  success: boolean;
  slug: string;
  updatedFields: string[];
  replacementsCount: number;
} {
  const targetFile = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(targetFile)) {
    throw new Error(`Article ${slug}.md not found in ${BLOG_DIR}`);
  }

  const post = parseBlogPost(targetFile);
  const updatedFrontmatter: BlogMetadata = {
    ...post.frontmatter,
    dateModified: updates.dateModified || new Date().toISOString().split("T")[0]
  };

  if (updates.metaTitle) updatedFrontmatter.metaTitle = updates.metaTitle;
  if (updates.description) updatedFrontmatter.description = updates.description;
  if (updates.tags) updatedFrontmatter.tags = updates.tags;

  let body = post.content;
  let repCount = 0;

  if (textReplacements && textReplacements.length > 0) {
    for (const item of textReplacements) {
      if (body.includes(item.search)) {
        body = body.replaceAll(item.search, item.replace);
        repCount++;
      }
    }
  }

  writeBlogPostFile(BLOG_DIR, slug, updatedFrontmatter, body);

  return {
    success: true,
    slug,
    updatedFields: Object.keys(updates),
    replacementsCount: repCount
  };
}
