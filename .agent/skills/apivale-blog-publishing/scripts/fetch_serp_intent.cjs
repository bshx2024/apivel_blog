#!/usr/bin/env node
const https = require('https');

async function getJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function getText(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function fetchSuggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=us&q=${encodeURIComponent(q)}`;
  const data = await getJson(url);
  return (data && Array.isArray(data[1])) ? data[1] : [];
}

async function fetchPAAFromHtml(keyword) {
  const url = `https://www.google.com/search?hl=en&gl=us&q=${encodeURIComponent(keyword)}`;
  const html = await getText(url);

  const questionSet = new Set();
  
  // Pattern 1: data-q attribute on questions
  const dqRegex = /data-q="([^"]+)"/g;
  let m;
  while ((m = dqRegex.exec(html)) !== null) {
    const q = m[1].trim();
    if (q.endsWith('?') || /^(is|what|how|why|does|which|can|who|where|are)\b/i.test(q)) {
      questionSet.add(q);
    }
  }

  // Pattern 2: span or div with question text
  const textQuestionRegex = />([^<>\n]{10,120}\?)<\/span>/g;
  while ((m = textQuestionRegex.exec(html)) !== null) {
    const q = m[1].trim();
    if (/^(is|what|how|why|does|which|can|who|where|are)\b/i.test(q)) {
      questionSet.add(q);
    }
  }

  // Pattern 3: JSON-like strings in script tags
  const jsonQRegex = /\["([^"]{10,120}\?)",null,/g;
  while ((m = jsonQRegex.exec(html)) !== null) {
    const q = m[1].trim();
    if (/^(is|what|how|why|does|which|can|who|where|are)\b/i.test(q)) {
      questionSet.add(q);
    }
  }

  return Array.from(questionSet);
}

async function harvestSerpIntent(query) {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    console.error('Error: Please provide a target keyword.');
    process.exit(1);
  }

  // 1. 无空格下拉词 (Without trailing space)
  const noSpace = await fetchSuggest(cleanQuery);

  // 2. 有空格下拉词 (With trailing space)
  const withSpace = await fetchSuggest(cleanQuery + ' ');

  // 3. 细分实体与变体拓展探测 (Entity Variants & Sub-queries)
  const relatedQueries = [];
  const parts = cleanQuery.split(/\s+/);
  
  if (cleanQuery.includes('vs')) {
    const [leftPart, rightPart] = cleanQuery.split(/\s+vs\s+/);
    if (leftPart && rightPart) {
      const leftSuggest = await fetchSuggest(leftPart.trim() + ' ');
      const rightSuggest = await fetchSuggest(rightPart.trim() + ' ');
      const leftVsSuggest = await fetchSuggest(leftPart.trim() + ' vs ');
      const rightVsSuggest = await fetchSuggest(rightPart.trim() + ' vs ');
      relatedQueries.push(...leftSuggest, ...rightSuggest, ...leftVsSuggest, ...rightVsSuggest);
    }
  } else if (parts.length >= 2) {
    const prefix = parts.slice(0, 2).join(' ') + ' ';
    const prefixSuggest = await fetchSuggest(prefix);
    relatedQueries.push(...prefixSuggest);
  }

  // 4. PAA 问答抓取
  let paa = await fetchPAAFromHtml(cleanQuery);
  if (paa.length === 0) {
    // 降级尝试主体词
    const baseEntity = parts.length > 1 ? parts[0] + ' ' + parts[1] : cleanQuery;
    paa = await fetchPAAFromHtml(baseEntity);
  }

  // 5. 跨界实体碰撞排查 (Negative Entity Collision Check)
  const allSuggestions = Array.from(new Set([...noSpace, ...withSpace, ...relatedQueries]));
  const negativeCollisionTriggers = [
    'gmc', 'chevy', 'chevrolet', 'ford', 'corvette', 'v8', 'engine', 
    'truck', 'opel', 'astra', 'motor', 'retopool', 'linear regression', 'glm net'
  ];
  const detectedCollisions = allSuggestions.filter(s => 
    negativeCollisionTriggers.some(t => new RegExp(`\\b${t}\\b`, 'i').test(s))
  );

  return {
    query: cleanQuery,
    dropdownNoSpace: noSpace,
    dropdownWithSpace: withSpace,
    relatedVariants: Array.from(new Set(relatedQueries)).slice(0, 10),
    allUniqueSuggestions: allSuggestions,
    paaQuestions: paa.slice(0, 6),
    detectedCollisions
  };
}

if (process.argv[2]) {
  harvestSerpIntent(process.argv[2]).then(result => {
    console.log(`\n========================================================================`);
    console.log(`🚀 Automated Google SERP Harvester (Dropdown + Trailing Space + PAA)`);
    console.log(`🎯 Target Core Keyword: "${result.query}"`);
    console.log(`========================================================================\n`);

    console.log('📌 1. Google 搜索下拉建议词 (无空格 / Without Trailing Space):');
    if (result.dropdownNoSpace.length > 0) {
      result.dropdownNoSpace.forEach((s, i) => console.log(`   [${i + 1}] ${s}`));
    } else {
      console.log('   (无直接下拉词)');
    }

    console.log('\n📌 2. Google 搜索下拉建议词 (有空格 / With Trailing Space):');
    if (result.dropdownWithSpace.length > 0) {
      result.dropdownWithSpace.forEach((s, i) => console.log(`   [${i + 1}] ${s}`));
    } else {
      console.log('   (无直接下拉词)');
    }

    if (result.relatedVariants.length > 0) {
      console.log(`\n📌 3. 关联变体与对比实体探测 (Related Variants):`);
      result.relatedVariants.forEach((s, i) => console.log(`   [${i + 1}] ${s}`));
    }

    console.log('\n📌 4. Google 首页 People Also Ask (PAA 原生问答):');
    if (result.paaQuestions.length > 0) {
      result.paaQuestions.forEach((q, i) => console.log(`   [PAA ${i + 1}] ${q}`));
    } else {
      console.log('   (未直接从 HTML 正则截获，由 search_web 备用通道提取)');
    }

    console.log('\n📌 5. 跨界实体冲突排查 (Negative Entity Ambiguity Check):');
    if (result.detectedCollisions.length > 0) {
      console.log(`   ⚠️ 警告：检测到跨领域碰撞词: ${JSON.stringify(result.detectedCollisions)}`);
      console.log(`   👉 必须在 Title/H1/Description 中全量显式绑定 AI / LLM / Model 定语！`);
    } else {
      console.log('   ✅ 安全：未检测到严重非技术跨界冲突。');
    }

    console.log('\n========================================================================');
    console.log('📦 结构化提取结果 (JSON):');
    console.log(JSON.stringify(result, null, 2));
    console.log('========================================================================\n');
  }).catch(console.error);
}

module.exports = { harvestSerpIntent };
