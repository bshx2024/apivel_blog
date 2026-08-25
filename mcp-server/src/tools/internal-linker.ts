import fs from "fs";
import path from "path";
import { BLOG_DIR } from "../utils/config";
import { getAllPublishedPosts, parseBlogPost, writeBlogPostFile } from "../utils/frontmatter";

export interface LinkInjectionRecord {
  sourceSlug: string;
  sourceTitle: string;
  injectedAnchor: string;
  linkInserted: string;
  snippetBefore: string;
  snippetAfter: string;
}

export function handleWeaveInternalLinks(
  targetSlug: string,
  targetTitle: string,
  anchorKeywords: string[],
  maxInjections = 3
): {
  targetSlug: string;
  totalInjected: number;
  injections: LinkInjectionRecord[];
  skippedArticles: string[];
} {
  const publishedPosts = getAllPublishedPosts();
  const injections: LinkInjectionRecord[] = [];
  const skipped: string[] = [];

  const targetLinkUrl = `/blog/${targetSlug}`;

  for (const post of publishedPosts) {
    if (post.slug === targetSlug) continue;
    if (injections.length >= maxInjections) break;

    // Check if post already links to this target slug
    if (post.content.includes(targetLinkUrl) || post.content.includes(`/${targetSlug}`)) {
      skipped.push(`${post.slug} (already links to target)`);
      continue;
    }

    let modifiedBody = post.content;
    let injectedForThisPost = false;

    for (const keyword of anchorKeywords) {
      if (injectedForThisPost) break;
      const kwTrimmed = keyword.trim();
      if (!kwTrimmed || kwTrimmed.length < 3) continue;

      const escapedKw = kwTrimmed.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const pattern = "(?<!\\[[^\\]]*)\\b(" + escapedKw + ")\\b(?![^\\[]*\\])(?![^<]*>)(?![^`]*`)";
      const regex = new RegExp(pattern, "i");

      const match = regex.exec(modifiedBody);
      if (match && match.index !== undefined) {
        const matchedText = match[1];
        const linkMarkdown = `[${matchedText}](${targetLinkUrl})`;

        const startIdx = Math.max(0, match.index - 40);
        const endIdx = Math.min(modifiedBody.length, match.index + matchedText.length + 40);
        const snippetBefore = modifiedBody.substring(startIdx, endIdx);

        modifiedBody =
          modifiedBody.substring(0, match.index) +
          linkMarkdown +
          modifiedBody.substring(match.index + matchedText.length);

        const snippetAfter = snippetBefore.replace(matchedText, linkMarkdown);

        writeBlogPostFile(BLOG_DIR, post.slug, post.frontmatter, modifiedBody);

        injections.push({
          sourceSlug: post.slug,
          sourceTitle: post.frontmatter.title || post.slug,
          injectedAnchor: matchedText,
          linkInserted: linkMarkdown,
          snippetBefore,
          snippetAfter
        });

        injectedForThisPost = true;
      }
    }
  }

  return {
    targetSlug,
    totalInjected: injections.length,
    injections,
    skippedArticles: skipped
  };
}
