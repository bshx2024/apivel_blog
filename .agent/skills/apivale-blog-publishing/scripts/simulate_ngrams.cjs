#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function analyzeNgrams(filePathOrHtml) {
  let html = '';
  if (fs.existsSync(filePathOrHtml)) {
    html = fs.readFileSync(filePathOrHtml, 'utf8');
  } else {
    html = filePathOrHtml;
  }

  // Strip scripts, styles, svgs, and tags
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  // Split tokens (preserve hyphens inside words, remove dots and punctuation)
  const tokens = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, ' ')
    .match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) || [];

  console.log(`\n======================================================`);
  console.log(`📊 N-gram Simulation Analysis: Total Tokens = ${tokens.length}`);
  console.log(`======================================================`);

  if (tokens.length > 1800) {
    console.warn(`⚠️ Warning: Total rendered tokens (${tokens.length}) > 1800! May lose 1 point on full-page word count.`);
  }

  for (let n = 2; n <= 5; n++) {
    const map = {};
    for (let i = 0; i <= tokens.length - n; i++) {
      const gram = tokens.slice(i, i + n).join(' ');
      map[gram] = (map[gram] || 0) + 1;
    }
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    console.log(`\n--- Top 5 ${n}-grams ---`);
    sorted.slice(0, 5).forEach(([gram, count], rank) => {
      console.log(`  #${rank + 1} (${count}x): "${gram}"`);
    });
  }

  // Preposition truncation warning
  const textLower = tokens.join(' ');
  if (/impact\s+on\s+senior\b/i.test(textLower)) {
    console.warn('\n⚠️ DANGER: Detected "impact on senior" in n-gram token stream! Preposition "on" will truncate "engineers" out of 4-word window.');
  }
}

if (process.argv[2]) {
  analyzeNgrams(process.argv[2]);
}

module.exports = { analyzeNgrams };
