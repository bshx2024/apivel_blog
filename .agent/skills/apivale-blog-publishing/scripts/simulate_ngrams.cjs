#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function analyzeNgrams(filePathOrHtml) {
  let content = '';
  if (fs.existsSync(filePathOrHtml)) {
    content = fs.readFileSync(filePathOrHtml, 'utf8');
  } else {
    content = filePathOrHtml;
  }

  // Extract H2 and H3 headings before stripping tags/markdown
  const h2h3List = [];
  const mdHeadingRegex = /^##+\s+(.+)$/gm;
  let hm;
  while ((hm = mdHeadingRegex.exec(content)) !== null) {
    h2h3List.push(hm[1].toLowerCase());
  }
  const htmlHeadingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  while ((hm = htmlHeadingRegex.exec(content)) !== null) {
    h2h3List.push(hm[1].replace(/<[^>]+>/g, '').toLowerCase());
  }

  // Strip scripts, styles, svgs, and tags
  let text = content
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
  console.log(`📊 N-gram Simulation & SEO Coach Analysis`);
  console.log(`Total Tokens: ${tokens.length}`);
  console.log(`======================================================`);

  if (tokens.length > 2500) {
    console.warn(`⚠️ Note: Rendered tokens (${tokens.length}) > 2500. Ensure pure markdown body text is within 1200-1800 words.`);
  }

  const topNgrams = {};
  for (let n = 2; n <= 4; n++) {
    const map = {};
    for (let i = 0; i <= tokens.length - n; i++) {
      const gram = tokens.slice(i, i + n).join(' ');
      map[gram] = (map[gram] || 0) + 1;
    }
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    topNgrams[n] = sorted;
    console.log(`\n--- Top 5 ${n}-grams ---`);
    sorted.slice(0, 5).forEach(([gram, count], rank) => {
      const density = ((count * n / tokens.length) * 100).toFixed(2);
      console.log(`  #${rank + 1} (${count}x, ~${density}%): "${gram}"`);
      
      // Density warning for 2-grams: if density > 2.5%, warn of potential stuffing or track misattribution
      if (n === 2 && count > 35 && density > 2.5) {
        console.warn(`    ⚠️ High 2-gram density (${density}%)! Sub-entity "${gram}" may trigger "赛道错位" or keyword stuffing.`);
      }
    });
  }

  // Check H2/H3 heading coverage for top 2-gram and 3-gram
  if (topNgrams[2] && topNgrams[2].length > 0 && h2h3List.length > 0) {
    const topPrimary2Gram = topNgrams[2][0][0];
    const topPrimaryWords = topPrimary2Gram.split(' ');
    const allHeadingsText = h2h3List.join(' ');
    
    console.log(`\n--- H2/H3 Heading Keyword Word Coverage ---`);
    console.log(`Checked Headings Count: ${h2h3List.length}`);
    console.log(`Top Primary Entity Tokens: [${topPrimaryWords.join(', ')}]`);
    
    let missedWords = [];
    topPrimaryWords.forEach(word => {
      if (!allHeadingsText.includes(word)) {
        missedWords.push(word);
      }
    });

    if (missedWords.length > 0) {
      console.warn(`⚠️ Warning: Words [${missedWords.join(', ')}] from top entity are MISSING in H2/H3 headings! May lose 1 point on 哥飞军师.`);
    } else {
      console.log(`✅ Great! Top entity tokens are present in H2/H3 headings.`);
    }
  }

  // Preposition truncation warning
  const textLower = tokens.join(' ');
  if (/impact\s+on\s+senior\b/i.test(textLower)) {
    console.warn('\n⚠️ DANGER: Detected "impact on senior" in token stream! Preposition "on" will truncate "engineers" out of 4-word window.');
  }
}

if (process.argv[2]) {
  analyzeNgrams(process.argv[2]);
}

module.exports = { analyzeNgrams };
