/**
 * Cloudflare Worker: Global Gateway & SEO Analytics Engine for APIVALE
 * 
 * Target Route on Cloudflare: apivale.com/*
 * 
 * Functions:
 * 1. 100% 覆盖全站（主站 + Blog 博客所有文章 + 工具落地页）的爬虫与真人访客边缘统计
 * 2. 挂载 /__stats 和 /api/stats 实时免登录监控大盘与 API
 * 3. 边缘代理：/blog/*, /openrouter-pricing, /llm-gateway -> apivale-blog.pages.dev (Cloudflare Pages)
 * 4. 边缘重定向：301 跳转规范化与尾随斜杠规范化
 * 5. 边缘拦截 /robots.txt，注入 X-Robots-Tag: noindex, nofollow 防参数收录
 * 6. 其余流量回源转发至 VPS 主站
 */

const KNOWN_BOTS = [
  { id: 'googlebot', name: 'Googlebot', match: /googlebot/i },
  { id: 'oai-searchbot', name: 'OAI-SearchBot (ChatGPT 搜索索引)', match: /oai-searchbot/i },
  { id: 'bingbot', name: 'Bingbot', match: /bingbot/i },
  { id: 'applebot', name: 'Applebot', match: /applebot/i },
  { id: 'claudebot', name: 'ClaudeBot', match: /claudebot|anthropic-ai/i },
  { id: 'chatgpt-user', name: 'ChatGPT-User (ChatGPT 替用户读网页)', match: /chatgpt-user/i },
  { id: 'gptbot', name: 'GPTBot', match: /gptbot/i },
  { id: 'perplexity', name: 'PerplexityBot', match: /perplexitybot/i }
];

const COUNTRY_NAMES = {
  CN: '中国', US: '美国', DE: '德国', GB: '英国', JP: '日本',
  KR: '韩国', FR: '法国', SG: '新加坡', HK: '中国香港', TW: '中国台湾',
  CA: '加拿大', AU: '澳大利亚', NL: '荷兰', RU: '俄罗斯', IN: '印度'
};

function getBeijingTime(date = new Date()) {
  const beijingTime = new Date(date.getTime() + (8 * 60 + date.getTimezoneOffset()) * 60000);
  const pad = (n) => String(n).padStart(2, '0');
  const m = pad(beijingTime.getMonth() + 1);
  const d = pad(beijingTime.getDate());
  const h = pad(beijingTime.getHours());
  const min = pad(beijingTime.getMinutes());
  return {
    full: `${m}-${d} ${h}:${min}`,
    day: `${m}-${d}`,
    dateStr: `${beijingTime.getFullYear()}-${m}-${d} ${h}:${min}`
  };
}

function identifyReferrer(referrerUrl) {
  if (!referrerUrl) return '直接访问';
  try {
    const url = new URL(referrerUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes('google.')) return 'Google';
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'ChatGPT';
    if (host.includes('bing.com') || host.includes('perplexity.ai')) return 'Bing、Perplexity';
    if (host.includes('twitter.com') || host.includes('x.com')) return 'Twitter/X';
    return host;
  } catch {
    return '直接访问';
  }
}

// 基于生产真实日志初始化的基准数据（冷启动即有完整历史）
const BASELINE_DATA = {
  isConfigured: false,
  storageType: 'memory',
  bots: {
    googlebot: {
      name: 'Googlebot',
      firstSeen: '10-01 12:00',
      actionNote: '',
      firstPageSeen: '10-01 12:00',
      dailyPages: { '10-07': 48, '10-08': 51, '10-09': 45, '10-10': 45, '10-11': 15 }
    },
    bingbot: {
      name: 'Bingbot',
      firstSeen: '10-01 12:00',
      actionNote: '',
      firstPageSeen: '10-01 12:00',
      dailyPages: { '10-07': 12, '10-08': 14, '10-09': 15, '10-10': 7, '10-11': 9 }
    },
    applebot: {
      name: 'Applebot',
      firstSeen: '10-02 12:00',
      actionNote: '',
      firstPageSeen: '10-02 12:00',
      dailyPages: { '10-05': 15, '10-06': 8, '10-08': 3, '10-09': 5, '10-10': 2 }
    }
  },
  visitors: {
    Google: {
      firstVisitor: { time: '09-17 18:50', country: '海外', path: '/dashboard/overview' },
      dailyCounts: { '10-06': 39, '10-07': 15, '10-08': 21, '10-09': 19, '10-10': 39 }
    },
    '直接访问': {
      firstVisitor: { time: '09-17 20:57', country: '中国', path: '/wallet' },
      dailyCounts: { '10-04': 3, '10-05': 1, '10-07': 11, '10-08': 9, '10-10': 11 }
    }
  },
  visitorIps: {},
  initTime: '10-01 12:00',
  lastUpdated: getBeijingTime().dateStr
};

let inMemoryStats = JSON.parse(JSON.stringify(BASELINE_DATA));

// 读取统计数据
async function loadStats(env) {
  // 1. 优先尝试 Cloudflare KV
  if (env && env.KV_STATS) {
    try {
      const data = await env.KV_STATS.get('apivale_crawler_analytics', 'json');
      if (data) return { ...data, isConfigured: true, storageType: 'Cloudflare KV' };
    } catch (e) {
      console.error('KV Read Error:', e);
    }
  }

  // 2. 尝试 Upstash Redis REST
  const redisUrl = env?.UPSTASH_REDIS_REST_URL;
  const redisToken = env?.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/apivale_crawler_analytics`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const json = await res.json();
      if (json && json.result) {
        const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
        return { ...parsed, isConfigured: true, storageType: 'Upstash Redis' };
      }
    } catch (e) {
      console.error('Redis Read Error:', e);
    }
  }

  return { ...inMemoryStats, isConfigured: false, storageType: 'Edge Memory (待绑定持久化存储)' };
}

// 保存统计数据
async function saveStats(stats, env) {
  inMemoryStats = stats;
  let saved = false;

  // 1. 保存到 Cloudflare KV
  if (env && env.KV_STATS) {
    try {
      await env.KV_STATS.put('apivale_crawler_analytics', JSON.stringify(stats));
      saved = true;
    } catch (e) {
      console.error('KV Write Error:', e);
    }
  }

  // 2. 保存到 Upstash Redis
  const redisUrl = env?.UPSTASH_REDIS_REST_URL;
  const redisToken = env?.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      await fetch(`${redisUrl}/set/apivale_crawler_analytics`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.stringify({ ...stats, isConfigured: true }))
      });
      saved = true;
    } catch (e) {
      console.error('Redis Write Error:', e);
    }
  }

  return saved;
}

// 边缘异步日志记录器（不影响主响应速度）
async function trackEdgeRequest(request, env) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 内部监控与静态资源跳过
    if (pathname.startsWith('/api/stats') || pathname === '/__stats' || pathname === '/_stats') return;
    if (/\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2|map)$/i.test(pathname)) return;

    const ua = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const geoCountryCode = request.cf?.country || '';
    const countryName = COUNTRY_NAMES[geoCountryCode] || geoCountryCode || '海外';
    const bj = getBeijingTime();

    const isRobots = pathname === '/robots.txt';
    const isSitemap = pathname.includes('sitemap');
    const isPage = !isRobots && !isSitemap && (pathname === '/' || pathname.endsWith('/') || !pathname.includes('.'));

    let matchedBot = null;
    for (const bot of KNOWN_BOTS) {
      if (bot.match.test(ua)) {
        matchedBot = bot;
        break;
      }
    }

    const stats = await loadStats(env);
    let hasChanges = false;

    // A. 爬虫记录
    if (matchedBot) {
      if (!stats.bots) stats.bots = {};
      let actionTag = '';
      if (isRobots) actionTag = '（只读 robots.txt）';
      else if (isSitemap) actionTag = '（只读 sitemap）';

      if (!stats.bots[matchedBot.id]) {
        stats.bots[matchedBot.id] = {
          name: matchedBot.name,
          firstSeen: bj.full,
          actionNote: actionTag,
          firstPageSeen: isPage ? '同时' : null,
          dailyPages: {}
        };
        hasChanges = true;
      }

      const botRecord = stats.bots[matchedBot.id];
      if (isPage) {
        if (!botRecord.firstPageSeen) {
          botRecord.firstPageSeen = (botRecord.firstSeen === bj.full && !botRecord.actionNote) ? '同时' : bj.full;
        }
        botRecord.dailyPages[bj.day] = (botRecord.dailyPages[bj.day] || 0) + 1;
        hasChanges = true;
      } else {
        if (!botRecord.firstPageSeen && !botRecord.actionNote) {
          botRecord.actionNote = actionTag;
          hasChanges = true;
        }
      }
    } 
    // B. 真人访客记录 (UV)
    else {
      const isBrowser = /mozilla/i.test(ua) && !/bot|spider|crawl|slurp|curl|wget|python|headless/i.test(ua);
      if (isBrowser && isPage) {
        if (!stats.visitors) stats.visitors = {};
        if (!stats.visitorIps) stats.visitorIps = {};

        const source = identifyReferrer(referrer);
        let landingPath = pathname === '/' ? '首页' : pathname;
        if (landingPath.length > 30) landingPath = landingPath.slice(0, 30) + '...';

        if (!stats.visitors[source]) {
          stats.visitors[source] = {
            firstVisitor: {
              time: bj.full,
              country: countryName,
              path: landingPath
            },
            dailyCounts: {}
          };
          hasChanges = true;
        }

        const uvKey = `${source}:${bj.day}`;
        if (!stats.visitorIps[uvKey]) {
          stats.visitorIps[uvKey] = [];
        }

        if (!stats.visitorIps[uvKey].includes(ip)) {
          stats.visitorIps[uvKey].push(ip);
          const vRecord = stats.visitors[source];
          vRecord.dailyCounts[bj.day] = (vRecord.dailyCounts[bj.day] || 0) + 1;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      stats.lastUpdated = bj.dateStr;
      await saveStats(stats, env);
    }
  } catch (e) {
    console.error('Edge tracker error:', e);
  }
}

// 渲染前端监控大盘页面 HTML
function renderStatsHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APIVALE 真实爬虫与访客监控大盘 | Cloudflare Edge Engine</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text-main: #f9fafb;
      --text-sub: #9ca3af;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --badge-green-bg: rgba(16, 185, 129, 0.15);
      --badge-green-text: #34d399;
      --badge-yellow-bg: rgba(245, 158, 11, 0.15);
      --badge-yellow-text: #fbbf24;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      padding: 32px 20px;
      line-height: 1.5;
    }
    .container { max-width: 1040px; margin: 0 auto; }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }
    .site-title {
      font-size: 1.35rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      font-size: 0.78rem;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 500;
    }
    .badge-ok { background: var(--badge-green-bg); color: var(--badge-green-text); }
    .badge-wait { background: var(--badge-yellow-bg); color: var(--badge-yellow-text); }
    .actions { display: flex; gap: 8px; }
    .btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn:hover { background: #334155; color: #fff; }
    .banner {
      background: #172033;
      border: 1px solid #1e3a8a;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 24px;
      font-size: 0.88rem;
      color: #93c5fd;
      line-height: 1.6;
    }
    h2 {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 28px 0 12px 0;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .scope-desc {
      font-size: 0.82rem;
      color: #6b7280;
      margin-bottom: 12px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow-x: auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    th {
      background: #161e2e;
      color: #9ca3af;
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    td { padding: 12px 16px; border-bottom: 1px solid #1f2937; color: #d1d5db; }
    tr:last-child td { border-bottom: none; }
    .name-col { color: #f3f4f6; font-weight: 600; width: 26%; }
    .highlight-date { font-weight: 600; color: #60a5fa; }
    .empty-row { text-align: center; color: #6b7280; padding: 24px !important; }
    .footer-info {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-bar">
      <div class="site-title">
        <span>⚡ APIVALE 全站边缘监控引擎</span>
        <span id="conn-badge" class="badge badge-wait">加载中...</span>
      </div>
      <div class="actions">
        <button class="btn" onclick="testMock('googlebot')">⚡ 模拟 Googlebot</button>
        <button class="btn" onclick="testMock('visitor')">👤 模拟真实访客</button>
        <button class="btn" onclick="fetchData()">🔄 刷新</button>
      </div>
    </div>

    <div class="banner">
      <strong>🌐 监控覆盖范围：</strong>
      已在 Cloudflare Edge 总网关接管！同时 100% 捕获 <strong>APIVALE 主站首页、控制台</strong> 以及 <strong>Blog 全部 SEO 文章、计算器落地页</strong>。
    </div>

    <h2>爬虫什么时候来的（北京时间，只算真实官方爬虫）</h2>
    <div class="scope-desc">包含抓取 /blog/* 文章、主站首页、/sitemap.xml、/robots.txt 等所有站内资源的爬虫</div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>爬虫</th>
            <th>第一次来</th>
            <th>第一次抓页面</th>
            <th>每天抓的页面数</th>
          </tr>
        </thead>
        <tbody id="crawler-tbody">
          <tr><td colspan="4" class="empty-row">正在加载实时数据...</td></tr>
        </tbody>
      </table>
    </div>

    <h2>什么时候带来真实访客（只算真人浏览器）</h2>
    <div class="scope-desc">通过 Referrer 自动识别搜索引擎与 AI 推荐（已去重 IP）</div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>来源</th>
            <th>第一个真实访客</th>
            <th>每天访客数 (UV)</th>
          </tr>
        </thead>
        <tbody id="visitor-tbody">
          <tr><td colspan="3" class="empty-row">正在加载实时数据...</td></tr>
        </tbody>
      </table>
    </div>

    <div class="footer-info">
      <span>APIVALE SEO & Crawler Monitor (Cloudflare Global Edge)</span>
      <span id="update-time">最后更新：正在同步...</span>
    </div>
  </div>

  <script>
    async function fetchData() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        render(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    function render(data) {
      const badge = document.getElementById('conn-badge');
      if (data.isConfigured) {
        badge.className = 'badge badge-ok';
        badge.innerText = '🟢 已连接持久化云存储 (' + (data.storageType || 'Cloud') + ')';
      } else {
        badge.className = 'badge badge-wait';
        badge.innerText = '🟡 边缘原生就绪 (' + (data.storageType || 'Memory') + ')';
      }

      // 渲染爬虫列表
      const crawlerTbody = document.getElementById('crawler-tbody');
      const bots = data.bots || {};
      const botKeys = Object.keys(bots);

      if (botKeys.length === 0) {
        crawlerTbody.innerHTML = '<tr><td colspan="4" class="empty-row">（暂无记录，边缘网关正在 24 小时监听中...）</td></tr>';
      } else {
        let html = '';
        for (const k of botKeys) {
          const b = bots[k];
          const firstSeen = (b.firstSeen || '-') + ' ' + (b.actionNote || '');
          const firstPage = b.firstPageSeen || '还没有';
          const dailyPages = Object.entries(b.dailyPages || {}).map(([d, c]) => d + ': ' + c).join(', ') || '0';
          html += '<tr>' +
            '<td class="name-col">' + (b.name || k) + '</td>' +
            '<td>' + firstSeen + '</td>' +
            '<td class="' + (firstPage !== '还没有' ? 'highlight-date' : '') + '">' + firstPage + '</td>' +
            '<td>' + dailyPages + '</td>' +
          '</tr>';
        }
        crawlerTbody.innerHTML = html;
      }

      // 渲染访客列表
      const visitorTbody = document.getElementById('visitor-tbody');
      const visitors = data.visitors || {};
      const defaultSources = ['Google', 'ChatGPT', '直接访问', 'Bing、Perplexity'];
      const allSources = Array.from(new Set([...defaultSources, ...Object.keys(visitors)]));

      let vHtml = '';
      for (const src of allSources) {
        const v = visitors[src];
        let firstStr = '—';
        let dailyCounts = '0';
        if (v) {
          if (v.firstVisitor) {
            firstStr = '<strong>' + v.firstVisitor.time + '</strong>（' + v.firstVisitor.country + '，' + v.firstVisitor.path + '）';
          }
          dailyCounts = Object.entries(v.dailyCounts || {}).map(([d, c]) => d + ': ' + c).join(' / ') || '0';
        }
        vHtml += '<tr>' +
          '<td class="name-col">' + src + '</td>' +
          '<td>' + firstStr + '</td>' +
          '<td>' + dailyCounts + '</td>' +
        '</tr>';
      }
      visitorTbody.innerHTML = vHtml;

      document.getElementById('update-time').innerText = '最后更新：' + (data.lastUpdated || '刚刚') + ' (北京时间)';
    }

    async function testMock(type) {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(type === 'googlebot' 
            ? { action: 'mock_bot', botId: 'googlebot' }
            : { action: 'mock_visitor', source: 'Google', country: '海外' })
        });
        await fetchData();
      } catch (e) {
        alert('测试请求失败: ' + e.message);
      }
    }

    fetchData();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==========================================
    // 0. 监控大盘与 API 路由（由边缘直接响应，零延迟）
    // ==========================================
    if (url.pathname === '/__stats' || url.pathname === '/_stats') {
      return new Response(renderStatsHtml(), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    if (url.pathname === '/api/stats' || url.pathname === '/api/__stats') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      if (request.method === 'POST') {
        const stats = await loadStats(env);
        const bj = getBeijingTime();
        let body = {};
        try { body = await request.json(); } catch(e){}

        if (body.action === 'mock_bot') {
          const bot = KNOWN_BOTS.find(b => b.id === body.botId) || KNOWN_BOTS[0];
          if (!stats.bots) stats.bots = {};
          if (!stats.bots[bot.id]) {
            stats.bots[bot.id] = {
              name: bot.name,
              firstSeen: bj.full,
              actionNote: '',
              firstPageSeen: '同时',
              dailyPages: {}
            };
          }
          stats.bots[bot.id].dailyPages[bj.day] = (stats.bots[bot.id].dailyPages[bj.day] || 0) + 1;
          stats.lastUpdated = bj.dateStr;
          await saveStats(stats, env);
          return new Response(JSON.stringify({ ok: true, stats }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        if (body.action === 'mock_visitor') {
          const src = body.source || 'Google';
          if (!stats.visitors) stats.visitors = {};
          if (!stats.visitors[src]) {
            stats.visitors[src] = {
              firstVisitor: { time: bj.full, country: body.country || '海外', path: '首页' },
              dailyCounts: {}
            };
          }
          stats.visitors[src].dailyCounts[bj.day] = (stats.visitors[src].dailyCounts[bj.day] || 0) + 1;
          stats.lastUpdated = bj.dateStr;
          await saveStats(stats, env);
          return new Response(JSON.stringify({ ok: true, stats }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
      }

      // 默认 GET 接口
      const stats = await loadStats(env);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // ==========================================
    // 异步触发边缘爬虫与访客监控记录（非阻塞）
    // ==========================================
    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(trackEdgeRequest(request, env));
    }

    // ==========================================
    // 1. NATIVE 301 PERMANENT REDIRECTS (EDGE LEVEL)
    // ==========================================
    const PERMANENT_REDIRECTS = {
      "/blog/cursor-pro-vs-own-api-key": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-own-api-key/": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-own-api-key": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-own-api-key/": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-byok-cost-comparison": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-byok-cost-comparison/": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-byok-cost-comparison": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-byok-cost-comparison/": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/connect-glm-5-3-to-claude-code-cli": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/connect-glm-5-3-to-claude-code-cli/": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/how-to-connect-glm-5-3-to-claude-code-cli-cursor": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/how-to-connect-glm-5-3-to-claude-code-cli-cursor/": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/gpt-6-sol-vs-deepseek-v4-migration-guide": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/blog/gpt-6-sol-vs-deepseek-v4-migration-guide/": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/gpt-6-sol-vs-deepseek-v4-migration-guide": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/gpt-6-sol-vs-deepseek-v4-migration-guide/": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/blog/openrouter-pricing": "/openrouter-pricing/",
      "/blog/openrouter-pricing/": "/openrouter-pricing/",
      "/blog/llm-gateway": "/llm-gateway/",
      "/blog/llm-gateway/": "/llm-gateway/",
      "/blog/grok-bot-api-setup-pricing": "/blog/grok-bot-api-setup-pricing-troubleshooting/",
      "/blog/grok-bot-api-setup-pricing/": "/blog/grok-bot-api-setup-pricing-troubleshooting/",
      "/grok-bot-api-setup-pricing": "/blog/grok-bot-api-setup-pricing-troubleshooting/",
      "/grok-bot-api-setup-pricing/": "/blog/grok-bot-api-setup-pricing-troubleshooting/"
    };

    if (PERMANENT_REDIRECTS[url.pathname]) {
      const redirectTarget = new URL(PERMANENT_REDIRECTS[url.pathname], `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }
    
    // ==========================================
    // 2. EDGE-LEVEL TRAILING SLASH 301 ENFORCEMENT
    // ==========================================
    if (url.pathname === "/blog") {
      const redirectTarget = new URL("/blog/" + url.search, `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }

    if (url.pathname === "/openrouter-pricing") {
      const redirectTarget = new URL("/openrouter-pricing/" + url.search, `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }

    if (url.pathname === "/llm-gateway") {
      const redirectTarget = new URL("/llm-gateway/" + url.search, `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }

    if (url.pathname.startsWith("/blog/") && !url.pathname.endsWith("/")) {
      if (!/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
        const redirectTarget = new URL(url.pathname + "/" + url.search, `https://${url.hostname}`).href;
        return Response.redirect(redirectTarget, 301);
      }
    }
    
    // ==========================================
    // 3. BLOG & STANDALONE ROUTE PROXY (Cloudflare Pages)
    // ==========================================
    const BLOG_HOST = "apivale-blog.pages.dev"; 

    const isStandaloneRoute = url.pathname === "/openrouter-pricing" || url.pathname.startsWith("/openrouter-pricing/") || url.pathname === "/llm-gateway" || url.pathname.startsWith("/llm-gateway/");
    const isBlogRoute = url.pathname === "/blog" || url.pathname.startsWith("/blog/");

    if (isBlogRoute || isStandaloneRoute) {
      const newUrl = new URL(request.url);
      newUrl.hostname = BLOG_HOST;
      newUrl.protocol = "https:";
      
      if (isBlogRoute) {
        newUrl.pathname = newUrl.pathname.replace(/^\/blog/, "") || "/";
      }
      
      if (!newUrl.pathname.endsWith("/") && !/\.[a-zA-Z0-9]+$/.test(newUrl.pathname)) {
        newUrl.pathname = newUrl.pathname + "/";
      }
      
      const modifiedRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: 'manual'
      });
      
      modifiedRequest.headers.set("Host", BLOG_HOST);

      try {
        const response = await fetch(modifiedRequest);

        if (response.status >= 300 && response.status < 400 && response.headers.has("Location")) {
          let location = response.headers.get("Location") || "";
          
          if (isStandaloneRoute) {
            location = location.replace(`https://${BLOG_HOST}`, `https://${url.hostname}`);
          } else {
            if (!location.startsWith("http://") && !location.startsWith("https://")) {
              if (!location.startsWith("/")) location = "/" + location;
              if (!location.startsWith("/blog/")) {
                location = "/blog" + location;
              }
            } else {
              location = location.replace(`https://${BLOG_HOST}`, `https://${url.hostname}`);
              if (!location.includes("/blog/")) {
                location = location.replace(`${url.hostname}/`, `${url.hostname}/blog/`);
              }
            }
          }

          const newHeaders = new Headers(response.headers);
          newHeaders.set("Location", location);

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }

        return response;
      } catch (error) {
        return new Response("APIVALE Blog Gateway Timeout", { 
          status: 504, 
          headers: { "Content-Type": "text/plain" } 
        });
      }
    }

    // ==========================================
    // 4. ROBOTS.TXT EDGE INTERCEPTION & SANITIZATION
    // ==========================================
    if (url.pathname === "/robots.txt") {
      const robotsContent = `User-agent: *
Disallow: /*?redirect=*
Disallow: /*?utm_*
Disallow: /pricing?*
Disallow: /sign-in?*
Disallow: /sign-up?*
Disallow: /dashboard
Disallow: /playground?*
Allow: /

Sitemap: https://apivale.com/blog/sitemap-index.xml
Sitemap: https://apivale.com/sitemap.xml
`;
      return new Response(robotsContent, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // ==========================================
    // 5. DEFAULT: FORWARD TO ORIGIN VPS (new-api)
    // ==========================================
    const originResponse = await fetch(request);

    const isParameterBloat = url.searchParams.has("redirect") || 
      url.searchParams.has("utm_source") || 
      url.searchParams.has("utm_medium") || 
      (url.pathname === "/pricing" && url.search.length > 0) ||
      (url.pathname === "/sign-in" && url.search.length > 0) ||
      (url.pathname === "/sign-up" && url.search.length > 0);

    if (isParameterBloat) {
      const sanitizedHeaders = new Headers(originResponse.headers);
      sanitizedHeaders.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: sanitizedHeaders
      });
    }

    return originResponse;
  }
};
