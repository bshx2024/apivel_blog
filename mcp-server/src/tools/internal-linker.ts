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

  // Pass 1: Direct exact text matching
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

  // Pass 2: Semantic contextual fallback injection if exact matches were insufficient
  if (injections.length < maxInjections) {
    // Rank unlinked posts by topic relevance to anchor keywords
    const targetTerms = [
      ...anchorKeywords.map(k => k.toLowerCase().split(/\s+/)).flat(),
      targetSlug.toLowerCase().split("-")
    ].flat().filter(t => t.length > 2);

    const scoredPosts = publishedPosts
      .filter(post => post.slug !== targetSlug && !post.content.includes(targetLinkUrl) && !post.content.includes(`/${targetSlug}`))
      .map(post => {
        let score = 0;
        const postText = (post.slug + " " + (post.frontmatter.title || "") + " " + post.content).toLowerCase();
        for (const term of targetTerms) {
          if (postText.includes(term)) score += 1;
        }
        return { post, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const { post } of scoredPosts) {
      if (injections.length >= maxInjections) break;

      let modifiedBody = post.content;
      const calloutText = `\n\n*(Looking for related setups? Check out our complete [${targetTitle}](${targetLinkUrl})).*`;

      // Find an optimal place to inject (before FAQ, before Conclusion, or after first comparison table)
      let insertIndex = -1;
      const markers = ["## Frequently Asked Questions", "### FAQ", "## Conclusion", "## Summary", "---"];
      
      for (const marker of markers) {
        const idx = modifiedBody.indexOf(marker);
        if (idx !== -1) {
          insertIndex = idx;
          break;
        }
      }

      if (insertIndex !== -1) {
        modifiedBody = modifiedBody.substring(0, insertIndex) + calloutText + "\n\n" + modifiedBody.substring(insertIndex);
      } else {
        modifiedBody += calloutText;
      }

      writeBlogPostFile(BLOG_DIR, post.slug, post.frontmatter, modifiedBody);

      injections.push({
        sourceSlug: post.slug,
        sourceTitle: post.frontmatter.title || post.slug,
        injectedAnchor: targetTitle,
        linkInserted: `[${targetTitle}](${targetLinkUrl})`,
        snippetBefore: "Contextual paragraph break",
        snippetAfter: calloutText.trim()
      });
    }
  }

  return {
    targetSlug,
    totalInjected: injections.length,
    injections,
    skippedArticles: skipped
  };
}
