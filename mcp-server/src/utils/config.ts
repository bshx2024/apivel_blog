import path from "path";
import fs from "fs";

function findProjectRoot(): string {
  let cur = import.meta.dir;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(cur, "astro.config.mjs")) || fs.existsSync(path.join(cur, "KEYWORD_PLAN.md"))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(import.meta.dir, "../../..");
}

export const PROJECT_ROOT = findProjectRoot();
export const BLOG_DIR = path.join(PROJECT_ROOT, "src/content/blog");
export const DRAFTS_DIR = path.join(PROJECT_ROOT, "src/content/drafts");
export const KEYWORD_PLAN_PATH = path.join(PROJECT_ROOT, "KEYWORD_PLAN.md");
export const WRITING_STANDARD_PATH = path.join(PROJECT_ROOT, "BLOG_WRITING_STANDARD.md");
export const ACTION_LOG_PATH = path.join(PROJECT_ROOT, "SEO_ACTION_LOG.md");
export const KEYWORD_MATRIX_PATH = path.join(PROJECT_ROOT, "SEO_KEYWORD_MATRIX.md");

// Ensure drafts directory exists
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

// Load .env.mcp if exists
export function loadEnvConfig(): Record<string, string> {
  const envPath = path.join(PROJECT_ROOT, ".env.mcp");
  const envVars: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          envVars[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  }
  return { ...envVars, ...process.env as Record<string, string> };
}
