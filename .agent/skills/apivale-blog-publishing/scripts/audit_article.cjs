#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function auditArticle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File does not exist at ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];

  console.log(`\n======================================================`);
  console.log(`🔍 Auditing APIVALE Blog Article: ${path.basename(filePath)}`);
  console.log(`======================================================`);

  // 1. Frontmatter parsing
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    errors.push('CRITICAL: No YAML frontmatter found (--- ... ---)');
    return report(errors, warnings, 0);
  }
  const fm = fmMatch[1];
  
  const getFmField = (field) => {
    const m = fm.match(new RegExp(`^${field}:\\s*"([^"]*)"`, 'm'));
    if (m) return m[1];
    const m2 = fm.match(new RegExp(`^${field}:\\s*([^\\r\\n]+)`, 'm'));
    return m2 ? m2[1].trim() : null;
  };

  const title = getFmField('title');
  const metaTitle = getFmField('metaTitle');
  const description = getFmField('description');
  const author = getFmField('author');
  const date = getFmField('date');

  console.log(`Title (${title ? title.length : 0} chars): "${title}"`);
  console.log(`MetaTitle (${metaTitle ? metaTitle.length : 0} chars): "${metaTitle}"`);
  console.log(`Description (${description ? description.length : 0} chars): "${description}"`);
  console.log(`Author: ${author} | Date: ${date}`);

  // MetaTitle checks
  if (!metaTitle) {
    errors.push('Missing metaTitle in frontmatter');
  } else {
    if (metaTitle.length < 50 || metaTitle.length > 60) {
      errors.push(`metaTitle length ${metaTitle.length} is outside 50-60 chars (max 600px rule)`);
    }
    if (!metaTitle.endsWith('| APIVALE') && !metaTitle.endsWith('| apivel')) {
      warnings.push('metaTitle does not end with standard brand hook "| APIVALE"');
    }
  }

  // Title checks
  if (!title) {
    errors.push('Missing title in frontmatter');
  } else if (title.length > 80) {
    errors.push(`Title length ${title.length} exceeds 80 chars maximum limit`);
  }

  // Preposition truncation check (The "on senior" bug)
  if (/impact\s+on\s+senior/i.test(metaTitle || '') || /impact\s+on\s+senior/i.test(title || '')) {
    warnings.push('CRITICAL WARNING: Found "impact on senior" in Title/H1! Preposition "on" will push "engineers" out of 4-word window, causing "elderly citizens" SERP misattribution. Use "impact senior engineers" instead.');
  }

  // Description checks
  if (!description) {
    errors.push('Missing description in frontmatter');
  } else if (description.length < 140 || description.length > 160) {
    errors.push(`Description length ${description.length} is outside 140-160 chars requirement`);
  }

  // Word count of body (excluding frontmatter, code blocks, scripts, and HTML tags)
  const bodyWithoutFm = content.slice(fmMatch[0].length);
  const bodyClean = bodyWithoutFm
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`|_\[\]\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = bodyClean.split(/\s+/).filter(w => w.length > 0);
  console.log(`\nEstimated visible words (excluding code/schema): ${words.length}`);
  if (words.length < 1200 || words.length > 1800) {
    warnings.push(`Visible word count ${words.length} is outside 1200-1800 words best-practice range`);
  }

  // Check H tags inside embedded HTML widgets
  const widgetRegex = /<div[\s\S]*?<\/div>/gi;
  let match;
  while ((match = widgetRegex.exec(bodyWithoutFm)) !== null) {
    if (/<h[1-6]/i.test(match[0])) {
      errors.push('Strict AST Violation: Found <h1-6> tag inside HTML <div> widget! Replace with <div class="font-bold...">');
      break;
    }
  }

  // Check native alert()
  if (/alert\s*\(/i.test(content)) {
    errors.push('Zero-Alert Rule Violated: Found native alert() usage! Code copy/interactive buttons must use in-place DOM states.');
  }

  // Payment methods: ban Stripe / Crypto
  if (/stripe/i.test(content)) {
    errors.push('Payment Compliance: Found "Stripe" reference! APIVALE officially supports PayPal & global credit cards.');
  }
  if (/\bcrypto\b|\busdt\b|\bbitcoin\b/i.test(content)) {
    errors.push('Payment Compliance: Found Crypto reference! APIVALE officially supports PayPal & global credit cards.');
  }

  // Payment methods: require PayPal
  if (!/paypal/i.test(content)) {
    warnings.push('Payment Compliance: No PayPal mention found! Master SOP requires explicit PayPal instant checkout endorsement.');
  }

  // Check Interactive element (<select, <input)
  if (!/<input/i.test(content) || !/<select/i.test(content)) {
    errors.push('Doorway Page Risk: Missing in-article interactive playground (<input> and <select>)! Will trigger 4.5 pt deduction.');
  }

  // Check .cta-card
  if (!content.includes('class="cta-card"')) {
    errors.push('CRO Compliance: Missing ending <div class="cta-card"> conversion container!');
  }

  // Check JSON-LD
  if (!content.includes('"@type": "FAQPage"') && !content.includes('"@type": "TechArticle"')) {
    errors.push('GEO Compliance: Missing FAQPage or TechArticle JSON-LD Schema!');
  }

  return report(errors, warnings, words.length);
}

function report(errors, warnings, wordCount) {
  console.log(`\n======================================================`);
  console.log(`📊 Audit Result: ${errors.length} Errors, ${warnings.length} Warnings`);
  console.log(`======================================================`);

  if (errors.length > 0) {
    console.error('\n❌ ERRORS (Must fix before publishing):');
    errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️ WARNINGS:');
    warnings.forEach((w, i) => console.warn(`  ${i + 1}. ${w}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ ALL GATES PASSED! Ready for atomic commit & build.');
  }

  return { errors, warnings, wordCount };
}

if (process.argv[2]) {
  auditArticle(process.argv[2]);
}

module.exports = { auditArticle };
