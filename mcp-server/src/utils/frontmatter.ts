import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BLOG_DIR, DRAFTS_DIR } from "./config";

export interface BlogMetadata {
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  dateModified?: string;
  author: string;
  authorTitle?: string;
  authorBio?: string;
  tags: string[];
  image?: string;
  lang?: string;
}

export interface BlogPost {
  slug: string;
  filePath: string;
  frontmatter: BlogMetadata;
  content: string;
  headings: string[];
  wordCount: number;
}

export function parseBlogPost(filePath: string): BlogPost {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const slug = path.basename(filePath, path.extname(filePath));
  
  // Extract all H2 and H3 headings
  const headings: string[] = [];
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(parsed.content)) !== null) {
    headings.push(match[1].trim());
  }

  const wordCount = parsed.content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    filePath,
    frontmatter: parsed.data as BlogMetadata,
    content: parsed.content,
    headings,
    wordCount
  };
}

export function getAllPublishedPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".md"));
  return files.map(f => parseBlogPost(path.join(BLOG_DIR, f)));
}

export function getAllDraftPosts(): BlogPost[] {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith(".md"));
  return files.map(f => parseBlogPost(path.join(DRAFTS_DIR, f)));
}

export function writeBlogPostFile(
  targetDir: string,
  slug: string,
  frontmatter: BlogMetadata,
  body: string
): string {
  const filePath = path.join(targetDir, `${slug}.md`);
  const fileContent = matter.stringify(body.trim() + "\n", frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf-8");
  return filePath;
}
