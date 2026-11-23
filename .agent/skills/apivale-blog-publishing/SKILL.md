---
name: apivale-blog-publishing
description: >-
  Standard Operating Procedure (SOP) and complete toolkit for researching, drafting,
  SEO/GEO optimizing, and atomically publishing high-converting technical blog posts for
  APIVALE (apivel.com / apivale.com). Use this skill whenever the user asks to write a blog post,
  research a tech topic/model keyword, optimize On-Page SEO (targeting 98+ A ratings on 哥飞军师),
  audit search intent from SERP screenshots, resolve keyword misalignment (the 'on' preposition bug),
  resolve sub-entity decimal stripping traps ('opus 5.5' -> 'opus 5'), maximize H2/H3 word coverage,
  embed interactive micro-tools, weave bidirectional mesh links, or execute the 5-Gate publishing protocol.
---

# APIVALE 技术博客端到端立项、撰写、SEO/GEO优化与发布军规 (Master Publishing Skill)

本文档是 APIVALE (`apivel.com` / `apivale.com`) 技术博客与 SEO/GEO 增长体系的**标准化作业规范 (SOP Skill)**。它沉淀自 **GPT-6.2 Astra vs Opus 5.5**、百度文心 5.5 Flash、DeepSeek V4、Qwen 4 等多篇 **98+ A / A+ 级** 高分实战经验，涵盖从**“SERP/PAA 截图意图采掘 $\rightarrow$ 3C 诊断与 4 项工程增益 $\rightarrow$ 规避介词截断错位 $\rightarrow$ 消除小数分词赛道错位 $\rightarrow$ 消除 Doorway Page 扣分 $\rightarrow$ 双向内链织网 $\rightarrow$ 5-Gate 原子发布”**的全生命周期。

---

## 目录
1. [核心铁律与商业意图隔离 (Non-Negotiable Directives)](#一核心铁律与商业意图隔离)
2. [Phase 1: 需求采掘与 3C 意图诊断 (Google 截图三层逆向采掘)](#二phase-1-需求采掘与-3c-意图诊断)
3. [Phase 2: 标题与元数据设计 (ABC 黄金公式与防踩坑法则)](#三phase-2-标题与元数据设计)
4. [Phase 3: 正文创作与“4 项真实工程增益” (AST 纯净度与 GEO 友好)](#四phase-3-正文创作与-4-项真实工程增益)
5. [Phase 4: 页面侧交互微工具与钱包转化闭环 (消除 4.5 分扣分)](#五phase-4-页面侧交互微工具与钱包转化闭环)
6. [Phase 5: ⭐ 哥飞军师 98+ A+ 军规级对齐技巧 (实战避坑宝典)](#六phase-5--哥飞军师-98-a-军规级对齐技巧)
7. [Phase 6: 5-Gate 原子发布与双向织网门禁](#七phase-6-5-gate-原子发布与双向织网门禁)
8. [Phase 7: 远程构建与军师闭环复测](#八phase-7-远程构建与军师闭环复测)

---

## 一、核心铁律与商业意图隔离

### 1. 商业意图纯净度防线 (P0 核心防呆)
* **唯一使命**：APIVALE 的使命是转化 **API 开发者、AI 工程师、技术初创团队** 使用我们低延迟、高可用的聚合网关（原生兼容 OpenAI / Anthropic 端点，支持 PayPal 即时直结与 0% 跨境手续费）。
* **意图强隔离**：文章核心必须锁定在 **商业/交易与高价值工程意图**（`api key`, `pricing`, `two-tier CI pipeline`, `pr review automation`, `cursor/claude code setup`），坚决防范 **信息类极客/纯硬件折腾意图**（`1-bit quantization`, `vLLM/GGUF weights`, `local VRAM self-hosting`）。若大量篇幅讨论本地跑分与量化，Google 会把页面打入跑分综合页，真正值钱的 API 词全掉至 50 名开外。
* **国产大模型引流桥梁 (Two-Tier Hybrid Router)**：在对比海外昂贵前沿模型（如 GPT-6.2 Astra $8/$40、Claude Opus 5.5 $4/$20）时，必须将社区对“5小时配额耗尽”、“429 速率限制”、“Thinking Token 账单爆炸”的痛点，引申至通过 APIVALE 两层网关方案：**90% 基础任务分流至 Qwen 3.7 Max ($0.25/$0.80) 与 DeepSeek V4 ($0.20/$0.60)**，实现降本 92% 并零停机容灾。

### 2. 官方支付与钱包权益严密对齐
* **官方支持支付方式**：主流推荐 **PayPal（PayPal 即时结账 / Pay with PayPal）**，支持全球国际信用卡（Visa, MasterCard, Amex）与支付宝（0 额外跨境手续费，免 KYC 认证）。**严禁提及 Stripe 或 Crypto/加密货币**。
* **钱包优惠三件套（必须 100% 准确写入 CTA）**：
  1. **+50% 首充特权**：充 $5 得 $7.50，充 $29 得 $43.50，充 $99 得 $148.50；
  2. **$29 开发者专享礼包**：直降 56%、4000万 Token、永久有效；
  3. **新用户 $0.20 免卡起步金**：注册即用，零门槛沙盒。

### 3. 作者轮换机制 (Persona Rotation)
每篇博文必须在现有作者库中轮换，杜绝同一作者连续署名：
* **Elena Rostova**：*Senior LLM Systems Architect & Agent Infrastructure Specialist*（专攻自主 Agent 推理循环、Thinking Token 预算控制与高并发路由）。
* **Kenji Tanaka**：*AI Developer Relations & Infrastructure Engineer*（专攻终端工作流、Claude Code CLI、多智能体调试与开发者生态）。
* **Sofia Costa**：*Senior Cloud & API Gateway Architect*（专攻跨国低延迟网关、容灾转移与计费透明度）。
* **Alex Rivera**：*Lead AI Systems Architect*（专攻企业级模型选型、分布式缓存与安全沙盒）。
* **Priya Sharma**：*AI Performance & Distributed Computing Engineer*（专攻基准评测、SWE-bench 复现与吞吐优化）。

---

## 二、Phase 1: 需求采掘与 3C 意图诊断

坚决反对凭空脑补题目。必须通过 Google SERP 真实截图标靶化逆向出用户的三层核心意图：

```
┌────────────────────────────────────────────────────────────────────────┐
│ 搜索意图 3 层漏斗模型                                                   │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 利益与焦虑层 (Financial/Token Anxiety):                             │
│    - Google 下拉首词（如 pricing, rate limits, 5-hour timeout）         │
│    - 关注点：钱、成本、API 消耗、配额熔断、并发限制                      │
├────────────────────────────────────────────────────────────────────────┤
│ 2. 行业与供需层 (Community Debates / Reddit):                          │
│    - 相关搜索（如 5.5 reddit, 5.5 difference）                          │
│    - 关注点：真实开发者评价、模型翻车吐槽、过度检查死循环                │
├────────────────────────────────────────────────────────────────────────┤
│ 3. 工程与技术痛点层 (Engineering Pain Points):                         │
│    - Google PAA (People Also Ask) 4 大高频问答                          │
│    - 关注点：基准真相 (SWE-bench)、端点报错 (429)、CI/CD 自动化网关      │
└────────────────────────────────────────────────────────────────────────┘
```

### 3C 诊断清单
1. **Content Type (内容类型)**：以权威技术深度评测与生产实操指南（Technical Deep-Dive & Engineering Guide）为主。
2. **Content Format (内容格式)**：结构化 AST（Technical Summary Box $\rightarrow$ 架构对比 $\rightarrow$ 官方/第三方基准表 $\rightarrow$ 社区原声卡片 $\rightarrow$ 两层架构方案 $\rightarrow$ 原生可交互微工具 $\rightarrow$ 15+行 Python 生产代码 $\rightarrow$ FAQ Schema）。
3. **Content Angle (切入视角)**：从“闭源双雄对决与开发者踩坑”迅速升华至“工程自动化解法”，自然引申至 APIVALE 的双层大模型（国产主力兜底 + 西方前沿突破）网关方案。

---

## 三、Phase 2: 标题与元数据设计

### 1. ABC 标题黄金公式
```text
[核心主词/场景] + [痛点利益/次要 LSI] | [APIVALE 品牌钩子]
```
* **字符数硬指标**：**50–60 字符（max 600px）**，必须以 `| APIVALE` 结尾。
* **H1 标题**：$\le 80$ 字符，直击核心痛点，且主词短语与 Title 保持 100% 对称。
* **Meta Description**：**140–160 字符**，高 CTR 承诺，必须完整包含自然语言核心词句。

### 2. 避坑铁律：防 4 词截断与介词挤出法则 (The "on" Bug Fix)
* **算法底层原理**：搜索引擎分词与 SEO 军师算法强制提取 **2~4 词组合** 作为推断词候选。
* **介词挤出陷阱**：
  若写作 `AI coding impact ON senior engineers`（5 词），算法向后滑 4 个词切片：
  `coding` (1) `impact` (2) `on` (3) `senior` (4) —— **最核心的技术定语 `engineers` 被挤出去了！**
  在英文中，`coding impact on senior` 失去 `engineer` 后，会被 Google 算法判定为 **“老年人 / 退休长者（Senior Citizens）学编程的影响”**，直接触发**致命的“赛道错位”扣分**！
* **避坑规程**：
  * Title、H1、URL 与正文高频锚点中，**核心词组坚决去除无意义介词**（如用冒号 `AI Coding Impact: Senior Engineers` 代替 `on`）；
  * 确保 4 词切片 100% 包含核心主体词；
  * Title、H1、URL 必须保持 100% 词群一致。

### 3. Evergreen 规范短 URL
* 统一格式：`/blog/<short-slug>/`
* 严禁带年份/日期（如 `/blog/2026-11-...`），全小写、短横线分隔，末尾严格带反斜杠 `/`。

---

## 四、Phase 3: 正文创作与“4 项真实工程增益”

### 1. 严格 AST 树纯净度红线 (Strict AST Widget Cleanliness)
* **P0 扣分红线**：所有自定义嵌入 HTML 组件（Technical Summary Box、社区原声卡片、Playground、ROI 计算器、CTA 卡片）中，**严禁使用原生 `<h1>`-`<h4>` 标签**！
* **统一规范**：全部使用 `<div class="font-bold text-white ...">` 或 `<span>` 加 CSS 类名，确保文章只有一条纯粹的 `H1 -> H2 -> H3` 语义树，彻底杜绝“标题跳级”扣分。

### 2. 独特性“4 项工程增益”标准
每篇博文必须落实以下 4 项硬核内容，构筑无法被 AI 仿造的内容护城河：
1. **架构可验证性证明 (Verifiable Architecture Proof)**：
   * 必须包含清晰的 Mermaid 拓扑图（展示两层网关或故障转移流水线）。
2. **客观中立对比表 (Honesty Architecture Table)**：
   * 必须包含客观的“适合场景 (Best For... / Honesty Column)”列，诚实列举竞品的优势与 APIVALE 网关的高性价比优势。
3. **真实社区原声卡片 (Primary-Source Community Voice)**：
   * 引用真实 Reddit（`r/ClaudeCode`, `r/OpenAI` 等）或 GitHub Issues 原话，附带真实链接与来源归属。
4. **15+ 行开箱即用生产代码 (Production Code / Config)**：
   * 必须提供完整、可直接粘贴运行的代码（如 Python 异步客户端、Cursor API 切换脚本），标注 BaseURL 为 `https://apivel.com/v1`。

### 3. GEO 大模型爬虫友好规范 (BLUF & FAQ Schema)
* **BLUF 原则 (Bottom Line Up Front)**：前 100 词内以加粗字体、明确主谓宾直接作答核心结论，便于大模型爬虫（SearchGPT, Perplexity）进行语义分块（Chunking）与直接引用。
* **Frontmatter `keyTakeaways`**：必须提供 4 个包含核心技术参数的键值对，供读者与爬虫 1 秒获取答案。
* **FAQPage JSON-LD 注入**：正文底部必须嵌入完整的 Schema 微数据，1:1 回应 Google 截图中的 4 大 PAA (People Also Ask) 问题，争夺 Google AI Overviews 零位引用。

---

## 五、Phase 4: 页面侧交互微工具与钱包转化闭环

### 1. 消除 4.5 分致命跳出扣分 (In-Article Live Playground)
* **SEO 引擎红线**：凡在正文、标题或 CTA 提及“试用/测试/体验/计算”等字样，必须内嵌原生交互体验区（包含实际可交互的 `<input>` / `<select>` / `<button>` 原生表单元素）。
* **零 Alert 规则**：严禁在 Markdown 中手写 `onclick="alert(...)"`，所有表单交互必须通过轻量内联 JS 实现纯前端 DOM 状态更新。
* **落地实践**：内嵌专属交互计算器（如 `Cost & Hybrid Savings Calculator`），用户滑动滑块或切换下拉框即可原地测算 API 成本节省，原地满足意图，锁死停留时间（Dwell Time）。

### 2. 结尾转化卡片 (`.cta-card`) 规范
结尾卡片必须严格包含以下要素：
```html
<div class="cta-card">
  <!-- 标题与副标题直击痛点 -->
  <!-- 钱包三权益：+50% 首充、 $29 开发者包、 $0.20 免费额度 -->
  <!-- 双按钮：/pricing 与 /sign-up，必须动态携带 redirect=/blog/<slug> -->
  <!-- 支付背书：PayPal 官方即时结账、全球信用卡、0% 外汇手续费 -->
</div>
```

---

## 六、Phase 5: ⭐ 哥飞军师 98+ A+ 军规级对齐技巧

本章节是实战调试中总结出的最核心、最隐蔽的提分秘籍，专门解决军师体检工具的底层扣分逻辑：

### 1. 标的 URL 输入陷阱（防 301 重定向与 Canonical 扣分）
* **陷阱现象**：若在哥飞军师中输入 `https://apivel.com/<slug>`（漏写 `/blog/`），会命中根域名路由重定向，直接跳转至首页，导致体检推断词变成根目录的 `deepseek api pricing`，并产生 **Canonical 错误（丢 1 分）**、**URL 未覆盖（丢 1.3 分）**、**跳转链过长（丢 1.5 分）**。
* **军规标准**：在军师体检时，必须严格输入完整的标准规范 URL：
  👉 **`https://apivel.com/blog/<slug>/`**（必须包含 `/blog/` 前缀与末尾 `/` 斜杠）。

### 2. 小数点去标点与次级实体堆砌陷阱 (Decimal Stripping Bug)
* **底层算法**：哥飞军师分词器会将英文小数点 `.` 视为空格！
  例如：`Opus 5.5` 会被切片为 `opus`、`5`、`5`。
* **赛道错位险情**：
  若在文中独立提及模型名字 `Opus 5.5` 达到 40~50 次，分词器统计出的 2-gram 词组 `opus 5` 会飙升至 50+ 次（密度突破 3.1%）。不仅会触发“关键词密度偏高（多词 >3% 属堆砌）”扣分，还会因为 Google SERP 中 `opus 5` 被早期泄露传闻占领，而触发致命的**“赛道错位”警告**！
* **黄金修复法则（N-Gram 手术）**：
  1. **强化完整比较实体**：把核心完整词组（如 `Astra vs Opus 5.5` / `GPT-6.2 Astra vs Opus 5.5`）作为第一主词，使其在 3-gram 和 4-gram 榜单中以 25~30 次的频次稳居前三。
  2. **稀释次级单模型词频**：对单个模型名称，大量替换为代词或官方功能定语（如 `Anthropic's flagship`, `the frontier model`, `OpenAI's planning engine`），将次级 2-gram（如 `opus 5`）的词频从 50+ 压制到 20~25 次以内，密度控制在 1.5%~1.8%。

### 3. H2/H3 关键词全词覆盖度算法 (挽回 H2/H3 丢 1 分)
* **算法判定规则**：军师会抓取当前推断出的核心词（如 `gpt-6 2 astra`），检查该词的**每一个单词（gpt, 6, 2, astra）是否在文章的 H2 和 H3 小标题中完整出现**。
* **丢分原因**：若 H2 小标题只写成 `## Astra vs Opus 5.5...`，漏掉了 `GPT-6.2` 这个词，则小标题中单词覆盖率只有 67%，直接丢掉 1 分！
* **必胜对齐标准**：
  * **所有核心 H2 小标题**：必须完整嵌入全实体名称，例如：
    - `## GPT-6.2 Astra vs Opus 5.5 Architecture: Core Structural Differences`
    - `## GPT-6.2 Astra vs Opus 5.5 Benchmarks: SWE-bench Scores & API Pricing`
    - `## GPT-6.2 Astra vs Opus 5.5 on Reddit: Rate Limits & Developer Traps`
    - `## Beating GPT-6.2 Astra vs Opus 5.5 Token Burn: Two-Tier Hybrid Router`
    - `## Interactive Cost Calculator: GPT-6.2 Astra vs Opus 5.5 Savings`
    - `## Frequently Asked Questions: GPT-6.2 Astra vs Opus 5.5 Differences`
  * **FAQ 的 H3 小标题**：直接采用 Google PAA (People Also Ask) 的原生问句（如 `### Why Is Opus 5.5 So Good for Agentic Coding?`、`### Is Opus 5.5 Faster Than Opus 5?`、`### What Is Better and Cheaper Than Opus 5?`）。

### 4. 正文字数黄金平衡
* **扣分规则**：全页词数（Rendered HTML Words）超过 1800 词会丢 1 分。
* **平衡策略**：
  * 纯 Markdown 正文的有效阅读词数控制在 **1,200 ~ 1,800 词**；
  * 虽然直出的交互代码与 Schema 会让全页总词数在 2600 词左右，但纯文字保持在 1700 词上下，既保证了技术深度与 GEO 采纳，又不会稀释主题聚焦度。

---

## 七、Phase 6: 5-Gate 原子发布与双向织网门禁

执行发布时，必须在一个完整事务中原子化完成 5 大门禁闭环，严禁留存半成品：

```mermaid
flowchart TD
    G1["Gate 1: 撰写博文 & 注册 TOPIC_CONFIG"] --> G2["Gate 2: 运行 audit_article.cjs (0 Errors, 0 Warnings)"]
    G2 --> G3["Gate 3: 双向内链织网 (必须同时修改 2-3 篇旧博文)"]
    G3 --> G4["Gate 4: 更新 public/llms.txt & 归档 SEO_ACTION_LOG.md"]
    G4 --> G5["Gate 5: 本地 bun run build 验证 & git push origin main"]
```

### Gate 1: 动态话题注册 (`src/pages/[slug].astro`)
若文章涉及新的场景或模型（如 `gpt-6-2-astra`, `claude-opus-5-5`, `qwen-3-7-max`），必须在 `src/pages/[slug].astro` 的 `TOPIC_CONFIG` 中注册专属中英文转化卡片文案（包含 `badge`、`title`、`desc`、`btnText`、`utmCampaign`）。

### Gate 2: 本地自动化前置体检
在终端运行审计工具（Windows 环境推荐使用 `bun`）：
```bash
bun .agent/skills/apivale-blog-publishing/scripts/audit_article.cjs src/content/blog/<article-slug>.md
```
必须达成：
* `0 Errors, 0 Warnings`；
* Title 长度 $\le 80$ 字符；MetaTitle 50–60 字符；Meta Description 140–160 字符；
* 正文可见词数严格在 **1,200 ~ 1,800 词**；
* 必须包含 `<input>` / `<select>` 与 `.cta-card`；
* 严禁出现 Stripe 或 Crypto。

### Gate 3: 双向内链织网 (Bi-directional Mesh Weaving)
* **严禁发布孤岛文章**：必须在同集群中搜索 2–3 篇已有高权重博文（如 `gpt-6-2-astra-benchmarks-price-reddit.md`, `claude-opus-5-5-price-limits-claude-code.md`, `gpt-6-2-sol-api-pricing-benchmarks.md`）。
* **立即打开并编辑旧博文**：在相关段落注入指向新博文的精准上下文锚文本链接，同时新博文必须出链至旧博文，形成互为支撑的网状拓扑回路。

### Gate 4: 知识库与动作日志归档
1. **GEO 知识库更新**：在 `public/llms.txt` 的 `## Core Model & Persistent Agent Guides` 下登记新文章的权威大模型检索摘要。
2. **动作日志归档**：在 `SEO_ACTION_LOG.md` 记录立项背景、主攻词、优化动作与 14 天因果响应假设。

### Gate 5: 编译测试与远程推送
1. 执行本地全量编译：
   ```bash
   bun run build
   ```
   必须确认 0 报错，静态页面全量生成成功。
2. 暂存所有涉及修改的文件（新博文 + 旧博文 + `[slug].astro` + `llms.txt` + `SEO_ACTION_LOG.md`），执行单一规范 Git Commit，并推送到远程仓库：
   ```bash
   git add -A; git commit -m "feat(blog): publish <slug> with bidirectional links & PAA alignment"; git push origin main
   ```

---

## 八、Phase 7: 远程构建与军师闭环复测

1. **CDN 缓存等待**：推送完成后，等待 1~2 分钟让 Cloudflare CDN 缓存自动生效。
2. **军师复测**：在哥飞军师（Page Coach）输入标准地址：
   `https://apivel.com/blog/<slug>/`
3. **合格线验收**：
   - 评级达到 **98+ A / A+**；
   - 主题聚焦度 **100%**；
   - 核心推断词精准命中目标意图；
   - **0 赛道错位警告**；
   - 关键词在 H2/H3 中 100% 单词覆盖。
