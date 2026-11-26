# AST 语义纯净度与内嵌微工具规范 (AST & Widgets Guide)

本文档规范 Markdown 正文中内嵌自定义 HTML 组件时的 AST 语法树纯净度要求，以及消除 4.5 分 Doorway Page 扣分的微工具设计规范。

---

## 一、 AST 纯净度红线 (Strict AST Widget Cleanliness)

### 1. 为什么禁止在组件中使用 `<h1-4>`？
* 纯 Markdown 文章遵循严密的语义树：
  `1个顶级 H1 -> 多个二级 H2 -> 每个 H2 下隶属的三级 H3`。
* 很多开发者习惯在自定义组件（如 Definition Box、Key Takeaways、CTA 卡片）中使用：
  ```html
  <div class="card">
    <h3>Title of Card</h3> <!-- 错误！破坏 AST 语义树 -->
  </div>
  ```
  这会导致 HTML 语义解析器把小卡片里的文字当成独立段落标题，引发**“标题跨级（H2 直接跳 H4）”**或**“标题层级混乱”**，在 SEO 体检中直接被扣分。

### 2. 正确规范：统一使用 `<div>` 或 `<span>` 加类名
所有卡片标题与小标头，必须使用无语义的展示型标签：
```html
<!-- 正确范例 -->
<div class="definition-box my-6 p-5 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
  <div class="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">Architecture Definition</div>
  <div class="text-sm text-slate-300 leading-relaxed">
    <strong>The Core Definition</strong>: Explicit, unambiguous explanation...
  </div>
</div>
```

---

## 二、 消除 4.5 分 Doorway Page 扣分：In-Article Live Playground

### 1. 规则红线
根据 SEO 军师与 Google 落地页质量评估标准：
* **凡在正文、Title、Description 或 CTA 提及“试用、测试、体验、测算”字样，页面必须具备原地承接能力**。
* 若用户点击所有“测试”均跳转至外部注册页或定价页，页面会被打上 **“纯跳转门页 (Doorway Page)”** 标签，扣除 **4.5 分（P0 致命级扣分）**！

### 2. 交互微工具实现模板 (以 PR Review Token Calculator 为例)
* **元素齐备**：必须同时包含可交互的原生表单元素 `<input>`、`<select>`、`<button>` 或滑块；
* **零 Alert 规则**：严禁使用 `alert()`，必须使用内联 JavaScript 动态计算并更新 DOM 元素；
* **代码范式**：

```html
<div class="not-prose my-8 p-6 rounded-2xl bg-[#0d1527] border border-cyan-500/30 shadow-xl">
  <div class="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
    <div>
      <div class="text-lg font-bold text-white">Interactive Engineering Calculator</div>
      <div class="text-xs text-slate-400">Real-time simulation based on production telemetry</div>
    </div>
    <span class="px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Live Simulation</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <label class="block text-xs font-mono uppercase text-slate-300 mb-2">Parameter 1</label>
      <input type="range" id="param1Input" min="2" max="60" value="12" class="w-full accent-cyan-400 cursor-pointer" oninput="updateCalc()" />
      <div class="flex justify-between text-xs text-slate-400 mt-1">
        <span>Min</span>
        <span id="param1Val" class="text-cyan-300 font-bold font-mono">12</span>
        <span>Max</span>
      </div>
    </div>

    <div>
      <label class="block text-xs font-mono uppercase text-slate-300 mb-2">Target Engine</label>
      <select id="engineSelect" class="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono cursor-pointer" onchange="updateCalc()">
        <option value="deepseek">DeepSeek V4 ($0.14/M)</option>
        <option value="qwen">Qwen 3.7 Max ($0.20/M)</option>
        <option value="ernie">ERNIE 5.5 Flash ($0.05/M)</option>
      </select>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
    <div class="text-xs text-slate-400 mb-1">Estimated Savings</div>
    <div id="resultVal" class="text-lg font-mono font-bold text-emerald-400">$1,850/mo</div>
  </div>
</div>

<script is:inline>
function updateCalc() {
  const p1 = parseInt(document.getElementById('param1Input').value, 10);
  document.getElementById('param1Val').innerText = p1;
  // 计算逻辑并更新 DOM
  const savings = p1 * 154;
  document.getElementById('resultVal').innerText = '$' + savings + '/mo';
}
document.addEventListener('DOMContentLoaded', updateCalc);
</script>
```

---

## 三、 标准结尾转化卡片 (`.cta-card`) 模板

```html
<div class="cta-card">
  <div class="my-10 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 text-center shadow-2xl">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
      <span>⚡ High-Performance Unified Gateway</span>
    </div>
    <div class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
      Deploy Production Model Routing with APIVALE
    </div>
    <div class="text-slate-300 max-w-2xl mx-auto mb-6 text-sm leading-relaxed">
      Sub-50ms latency, OpenAI- and Anthropic-compatible endpoints, zero KYC barriers, and instant PayPal checkout.
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-8 text-left text-xs font-mono">
      <div class="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20">
        <div class="text-cyan-400 font-bold mb-1">+50% Deposit Bonus</div>
        <div class="text-slate-400">$5 &rarr; $7.50 | $29 &rarr; $43.50</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20">
        <div class="text-cyan-400 font-bold mb-1">$29 Dev Starter Pack</div>
        <div class="text-slate-400">40M Tokens (56% OFF, No Expiry)</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20">
        <div class="text-cyan-400 font-bold mb-1">$0.20 Free Sandbox</div>
        <div class="text-slate-400">Zero Credit Card / Instant Start</div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="https://apivel.com/sign-up?preset=<model>&redirect=%2Fdashboard%3Fquickstart%3Dtrue&from_blog=<slug>" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20" rel="nofollow">
        Claim $0.20 Free Trial &rarr;
      </a>
      <a href="https://apivel.com/pricing?from_blog=<slug>" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition" rel="nofollow">
        Explore Model Pricing
      </a>
    </div>
    <div class="text-slate-400 text-xs mt-4">
      Official PayPal Instant Checkout &bull; Global Credit Cards (Visa / MasterCard) &bull; 0% Foreign FX Fees
    </div>
  </div>
</div>
```

> **Zero-Circular-Redirect & H2 Anchor 规范**：
> - **严禁使用 `redirect=/blog/<slug>` 或 `redirect=%2Fblog...`**，避免新用户注册/登录后被回跳到文章页陷入死循环；来源追踪统一使用 `from_blog=<slug>`，注册后 `redirect` 统一指向 `%2Fdashboard%3Fquickstart%3Dtrue`。
> - 文章 Markdown 正文必须包含 **至少 3 个清晰的 `## ` 二级 H2 标题**，以便大纲语义分块及未来 In-Content 代码桥接组件锚定。
