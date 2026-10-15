# APIVALE 技术博客写作与 SEO/GEO 优化标准 (Master Blog Writing & SEO/GEO Standard)

本文档是 `apivale.com` 技术博客规范的 **唯一事实来源 (Single Source of Truth, SSOT)**。无论是人类技术编辑、开发者，还是 AI 写作 Agent（如 Antigravity, Claude Code, Cursor），在撰写、审阅或更新任何 APIVALE 博客文章时，均**必须严格遵循**本文档的规范。

---

## 1. 定位与受众策略 (Target Audience & Positioning)

针对 APIVALE 的受众特点（Developers, AI Engineers, Technical Founders, CTOs），文章定位强调**干货密集、工程可落地、权威实测与高性价比 API 解决方案**。

| 维度 | 传统工业/商业博客 | APIVALE 开发者技术博客标准 (本项目) |
| :--- | :--- | :--- |
| **受众定位** | 传统企业决策者（偏重商业 ROI 与政策） | 开发者、独立创作者、AI 工程师、CTO（偏重技术实现、成本与可靠性） |
| **文章字数** | 2500 - 3500 词 | **1200 - 1800 词最佳**（严防长文冗余导致核心主题稀释；包含可运行代码与数学推算，行文高效直接、无废话） |
| **核心卖点** | 概念灌输、宏观趋势 | **PayPal 官方即时结账、全球信用卡/支付宝扫码、0 额外跨境手续费承诺、免实名、免+86手机号、100% 官方代理路由、低延迟高并发** |
| **技术元素** | 理论原理、趋势报告 | **可直接运行的代码 (cURL/Python/TS)、异常处理、延迟与 Token 成本计算公式** |
| **GEO 重点** | 行业权威背书 | **直击痛点（API 401/403/429/502 错误码排查、代理 Header 冲突、流式缓冲丢包）** |

---

## 2. 4 步标准创作工作流 (Standard Operating Procedure - 4 Steps)

撰写任何一篇 APIVALE 博客前，必须严格执行以下 4 步工作流：

```
┌────────────────────────────────────────────────────────┐
│ Step 1: Target Keyword & Parent Topic Audit            │
│ 选取关键词 -> 校验父级主题 (Parent Topic) -> 提取 LSI    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Step 2: SERP 3C & Primary-Source Mining Audit          │
│ 3C 诊断 -> 社区原声采掘 -> 分级下钻 Content Gap         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Step 3: Outranking & Honesty Architecture              │
│ PAS + 社区原声 -> Honesty Ranks -> 4 项工程增益         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Step 4: Drafting, Pre-Flight Audit & Atomic Publishing │
│ Gate 1-5 原子闭环 -> HTTP 探针 -> 双向织网 -> 线上验证   │
└────────────────────────────────────────────────────────┘
```

### Step 1: 目标关键词选取与父级主题校验 (Parent Topic & Entity Audit)
- 查阅 `KEYWORD_PLAN.md` 确定目标关键词。
- **父级主题与辅助词校验 (Parent Topic & Secondary LSI Audit)**：
  - 验证目标关键词是否挂载在搜索量最大的父级主题下（例如搜索 `qwen 3.7 max api` 时，确认父级主题是否为 `qwen 3.7 max claude code setup`）。以父级主题为 Primary Target 才能获得最大流量上限。
  - 提取 1-2 个竞争对手共享的高频次要关键词（Secondary LSI），自然融入 Title Tag 和 H2/H3 小标题。
- **商业意图纯净度与防跑分稀释准则 (Commercial Intent vs. Benchmark Dilution Audit - P0 核心防呆)**：
  - **定位清晰**：APIVALE 的唯一使命是转化 API 开发者与企业调用客户，**绝非开源模型硬件折腾社区**。
  - **意图强隔离**：目标词与文章核心必须锁定在 **商业/交易类意图（Commercial / Transactional Intent）**（如 `api key`, `pricing`, `free api trial`, `cursor/claude code setup`），坚决防范 **信息类极客意图（Informational Hacker Intent）**（如 `1-bit quantization`, `vLLM/GGUF weights`, `local VRAM self-hosting`）。
  - **惨痛教训警示**：若在文章中花费大量篇幅甚至独立小标题探讨开源模型量化与本地部署，Google 算法会直接将页面误判为“开源跑分/本地部署综合页”，导致排在前排的全是 0 转化的跑分词（GGUF, 1-bit），而真正值钱的 API 词被稀释至 50~100 名开外！
- **实体-概念网络设计 (Entity-Relationship Network Audit)**：
  - 明确文章包含的 **3-5 个核心实体链 (Entity Chains)**（例如：`APIVALE Router` $\rightarrow$ `OpenAI SDK Protocol` $\rightarrow$ `Claude Code CLI` $\rightarrow$ `PayPal / Global Billing`）。确保正文中核心实体及其强关联概念自然共现，构建高密度实体图谱。

### Step 2: SERP 竞品检索、3C 诊断与社区原声采掘 (SERP 3C & Primary-Source Mining Audit)
- 对目标关键词进行搜索引擎检索，获取排名 Top 5 的竞品页面，并读取全文/HTML。
- **搜索意图 3C 诊断 (Search Intent 3C Diagnosis)**：
  - **Content Type (内容类型)**：确认主导类型（Blog post, Landing page, Technical Documentation）。
  - **Content Format (内容格式)**：确认主导格式（How-To Tutorial, Listicle, Comparison Review, Deep-dive Guide）。文章**必须**与主流格式保持一致！
  - **Content Angle (切入视角)**：分析竞品切入角度（如 *"2026 Latest"*, *"Zero Credit Card"*），定义 APIVALE 的胜出切角（如 *"Waffo Billing + Multi-Gateway Fallback"*）。
- **真实社区原声采掘 (Primary-Source Social Mining - 防杜撰机制)**：
  - 核心原则：**真实用户原声是无法抄袭的护城河 (Primary-source content is the moat)**。
  - **采掘通道（禁止模型凭空脑补）**：
    - GitHub Issues 检索（通过官方开放 API 或真实抓取，提取官方仓库中的真实报错与用户 Issue）；
    - Reddit / Hacker News 检索（通过 `site:reddit.com` / `site:news.ycombinator.com` 检索真实讨论串与 URL）；
  - **采掘内容**：提取 1 条真实的开发者报错痛点、抱怨或配置困惑（包含真实的 URL、平台和作者 handle）。
  - **防幻觉降级兜底**：若该技术极为前沿冷门，无法搜索到 100% 可验证的外部帖子，**坚决严禁造假**！必须降级为“官方 RFC/官方文档直链”或“APIVALE 生产网关脱敏工单日志”。
- **分级主题下钻与技术缝隙挖掘 (Multi-Level Topic Drill-Down & Content Gap Mining)**：
  - 利用 SERP 顶部 Topic 胶囊按钮、Google Images 标签、搜索框下拉建议与 PAA 进行 2-3 层逐层点击下钻（Drill-Down）：
    - **一级主题 (Topic 1 - 大类维度)**：搜主词出的第一排标签（如竞品 `Claude Opus` / `DeepSeek V4`、场景 `Coding`），决定文章 H2 核心逻辑模块。
    - **二级主题 (Topic 2 - 细分板块)**：点击一级标签后刷新出的子标签（如点击 `Coding` 刷出 `Claude Code` / `Rate Limit`），决定 H3 支撑层级。
    - **三级主题 (Topic 3 - 硬核细节)**：再次下钻刷出的细节（如 `base_url` / `429 Error`），决定 15+ 行代码示例与避坑解决方案。
- **双轨组合拳原则 (Baseline vs. Outranking Rule)**：
  - **Top 5 竞品 3C 诊断 = 保底线 (Baseline)**：决定文章格式与基础骨架，确保符合 Google 已认可的搜索意图，拿到进入前 10 名的门票。
  - **分级主题下钻 + 社区原声 = 冲第一 (Outranking)**：挖出竞品未触及的技术盲区与真实原声，赋予文章极高的**信息增益 (Information Gain)** 和不可替代性。

### Step 3: 超越策略与客观中立架构设计 (Outranking & Honesty Architecture)
- 制定 3 层关键词架构（Tier 1 主词在 Title/H1/前100字；Tier 2 LSI 词在 H2/H3；Tier 3 品牌与竞品词在正文）。
- 落地 **PAS 引言公式**（结合 Step 2 挖掘的真实开发者原声痛点切入 -> Agitate 放大痛苦 -> Solve 引入 APIVALE 方案）。
- 落地 **E-E-A-T 权威锚点**（如 *"基于 APIVALE 生产网关 10,000+ 次 API Agent 调用的实测数据..."*）。
- 落地 **客观披露与诚实评测机制 (Honesty Ranks Standard)**：
  - 在竞品与方案对比中，坦诚指出竞品的物理正向优势（如官方直签 SOC2 合规、AWS 内部 VPC 专线打通），同时清晰界定 APIVALE 专长领域（Waffo 全球免实名支付、跨网关智能故障转移、开箱即用）。客观透明反而极大提升开发者信赖感。
- 落地 **独特性“4 项工程增益”规范**（详见第 4 节）。

### Step 4: 撰写、前置体检与原子双向发布门禁 (Drafting, Pre-Flight Audit & Atomic Bidirectional Publishing)

在执行 Step 4 时，AI 智能体与技术编辑**必须在单次任务中原子化完成以下 5 大门禁闭环**，严禁留存半成品：

1. **Gate 1 (撰写、真实原声、CRO 交互工具与落地承接注入)**：
   - 在 `src/content/blog/<article-slug>.md` 撰写 Markdown 文件；
   - 严格落实“4 项真实工程增益” + 植入可点击验证的**真实社区原声卡片（或官方 RFC/脱敏日志降级引用）**；
   - 对比表格中必须包含客观“竞品正向优势列 (Best for...)”与当日抓取核验的时间戳；
   - 注入**页面侧即时承接微工具 (In-Article Live Playground / Config Tester)**：凡在正文、标题或 CTA 提及“试用/测试/体验”等字样，必须内嵌轻量原生交互体验区（包含实际可交互的 `<input>`/`<select>`/`<button>` 原生表单元素），让用户免注册原地实操，彻底消除纯跳转落地页（Doorway Page）被 SEO 体检引擎扣 4.5 分（P0 致命扣分项）的风险；
   - 注入**结尾钱包对齐转化卡片 (`.cta-card`)**：严格对齐 APIVALE 钱包实际方案：首充特权额外送 +50%（充 $5 得 $7.50，充 $29 得 $43.50，充 $99 得 $148.50）、$29 开发者专享礼包（直降 56%、4000万 Token、永久有效）、新用户 $0.20 免卡免实名起步金；提供双行动按钮（直达定价页 `/pricing` 与直达快速注册页 `/sign-up`），且必须动态携带 `redirect=/blog/<slug>`；
   - 严格执行**组件无 H 标签红线 (Strict AST Widget Cleanliness)**：自定义内嵌 HTML 组件（如 Definition Box、Key Takeaways、Playground、CRO 卡片）中**严禁使用原生 `<h1>`-`<h4>` 标签**，统一使用 `<div class="font-semibold text-white ...">` 或 `<span>` 加 CSS 类名，杜绝破坏纯 Markdown 的 `H1 -> H2 -> H3` 语义树而被判定“标题跳级”扣分；
   - **动态侧边栏模型话题注册 (Dynamic Floating CTA Topic Registry)**：若文章涉及新大模型（如 Xiaomi MiMo、GLM、Qwen、DeepSeek 等），必须同步在 `src/pages/[slug].astro` 的 `TOPIC_CONFIG` 中注册专属中英文转化卡片文案（包含 `badge`、`title`、`desc`、`metric`、`ctaText`）；
   - 注入 **FAQ JSON-LD Schema**。
2. **Gate 2 (前置自动化 SEO 健康度与真实性体检)**：
   - 自动运行 `audit_article_seo_health` 工具；
   - **外部链接 HTTP 探针**：自动校验正文中所有外部链接（特别是 GitHub Issue / Reddit 引用），必须返回 `HTTP 200`，任何 404 死链直接作为 S0 Blocker 拦截！
   - **对比数据核验**：确保对比表格包含最新官方核准时间戳与来源出处说明；
   - 强制确保：0 Blockers、0 Warnings、MetaTitle 严格 50–60 字符 (Max 600px 宽度)、H1 <= 80 字符、Meta Description 140–160 字符、正文可见词数 1200–1800 词最佳（防止冗余稀释）、全面落实 PayPal 官方即时结账与全球免 KYC 结算标准、内嵌交互体验区消除 4.5 分落地页跳出风险。
3. **Gate 3 (原子双向内链织网 - 必须同步修改老文章)**：
   - 自动在站内检索同主题/相关主题的 2~3 篇核心高权重老文章；
   - **在同一次修改中直接打开并编辑这些老文章**，将新文章作为上下文精准锚文本/Mermaid 节点织入老文章正文，实现双向权重闭环，坚决杜绝孤岛页面。
4. **Gate 4 (动作日志强制归档)**：
   - 在 `SEO_ACTION_LOG.md` 顶部按格式自动归档当日动作、影响 URL、目标关键词与 14 天因果假设。
5. **Gate 5 (原子提交、推送与线上 200 状态验证)**：
   - 将新博文、老博文修改、动作日志在同一次 Git 事务中提交并推送至 `origin main`；
   - 验证 CI/CD 编译与 CDN 线上生成状态，确保线上 URL 返回 200 且正常渲染。

---

## 3. 文章结构与 H 标签语义树标准 (Article Structure & AST Tree)

每篇技术文章必须严格遵循倒金字塔大纲结构与树状 H 标签语法层级，确保读者与 LLM AST 语法分析器能够精准解析。

```
├── 1. Title Tag & H1 (双轨分工, ABC 标题公式, 50-60字符 cap)
├── 2. Frontmatter Description (140-160字符, AI 引用第3权重摘要)
├── 3. Frontmatter keyTakeaways (结构化答案前置要点：SDK兼容协议/旗舰调用标识/Base URL/免卡测试额度)
├── 4. Answer-First Key Takeaways Module (首屏 1 秒高密度技术速览卡片，杜绝模板化硬编码)
├── 5. PAS Introduction (痛点陈述 + E-E-A-T 锚点 + 可运行的最简 cURL 代码示例)
├── 6. Primary-Source Community Voice (真实社区原声卡片：引用真实可跳转的 GitHub Issue / Reddit 原声，或降级为脱敏网关日志)
├── 7. Defined Snippet Box (定义框：捕捉 Position Zero 精选摘要)
├── 8. Objective Comparison Table (前 20% 处：含客观 "Best for..." 竞品正向优势列与核验时间戳的硬核对比)
├── 9. Technical Modules (2-3个 H2/H3 核心板块，回答 AI Query Fan-Out 衍生子问题)
├── 10. Interactive CRO Micro-Tool (交互式计算器/配置生成器组件)
├── 11. Developer FAQ (针对 AI GEO 抓取的 3-4 个精炼技术问答)
├── 12. Schema JSON-LD (FAQPage 结构化数据)
└── 13. Contextual CTA Module (开发者导向：Waffo 快捷充值、API Key 免费创建，携带当前文章无缝回跳)
```

#### Frontmatter keyTakeaways 结构化配置规范
为贯彻 **答案前置法则（Answer-First / BLUF 原则）** 并彻底杜绝全站模板化硬编码，每篇博文在 Frontmatter 中应配置专属的 `keyTakeaways` 数组（系统将优先读取并渲染）：
```yaml
---
title: "How to Connect Qwen 3.8 to Cursor IDE: Custom API Key, .cursorrules & Cost Guide"
metaTitle: "Qwen 3.8 Cursor Setup: Custom API Key & Rules | APIVALE"
description: "Connect Qwen 3.8 to Cursor IDE with custom API key, baseURL override, and Waffo global billing..."
date: "2026-08-21"
author: "Kenji Tanaka"
authorTitle: "AI Developer Relations Engineer, APIVALE"
tags: ["Qwen 3.8", "Cursor", "OpenAI API", "APIVALE", "Waffo"]
keyTakeaways:
  - label: "Flagship Invocation"
    value: "infer/qwen3.7-max"
    isCode: true
  - label: "Target Workflows"
    value: "Claude Code CLI, Cursor, Windsurf"
  - label: "Integration Base URL"
    value: "https://apivel.com/v1"
    isCode: true
  - label: "Billing & Quota"
    value: "PayPal & Global Cards ($0.20 Trial)"
    highlight: true
---
```

### H 标签语义树排版红线 (Heading AST Hierarchy)
*   **唯一 `<h1>`**：每篇文章只能有 **1 个 H1**（即 Frontmatter 中的 `title` 或 Markdown 顶部的 `# Title`）。
*   **论点层级 (`<h2>`)**：`<h2>` 用于划分核心逻辑模块（如环境搭建、代码实现、踩坑解决、价格对比）。
*   **支持层级 (`<h3>`)**：`<h3>` 用于放置支撑 H2 的具体步骤、语言分支（Python/TS）或示例。
*   **对称化语义子节点原则 (Symmetric Sub-node Rule)**：**禁止单个 H2 下仅挂载 1 个 H3 标题**。如果使用了 H3，则在同一个 H2 下必须至少包含 2 个或以上平行维度的 H3 步骤、语言分支或子板块。这能保证 LLM/RAG 分块检索时，子版块结构完整，防止单个 H3 导致语义碎片化。
*   **禁止跨级跳跃**：**严禁直接从 H1 跳到 H3**，必须严格按照 H1 -> H2 -> H3 逐层递进，确保 LLM 爬虫快速构建文章层级图谱。
*   **内嵌 HTML 组件严禁使用 `<h1..4>` 标签 (Strict HTML Widget Tag Rule)**：在 Markdown 正文内嵌的任何自定义 HTML 组件（包括 Definition Box、Key Takeaways Box、Playground、CRO 卡片、FAQ 等）中，**严禁使用原生 `<h1>`, `<h2>`, `<h3>`, `<h4>` 标签**，必须统一使用 `<div class="font-semibold text-white ...">` 或 `<span>` 加 CSS 类名。否则会被 AST 语法分析引擎判定为“跳级或多余 H 标签”，在 SEO 体检中直接扣除 1.5 分。
*   **陈述句首写与单语义消歧原则 (Declarative & Monosemanticity Rule)**：每个 H2/H3 小标题下方的**第一句话**必须使用直接、明确的陈述句概括核心结论，同时消除多义词歧义（Monosemanticity）。必须明确写出【动作 + 核心实体 + 具体技术上下文】（例如：“*Configure APIVALE's OpenAI-compatible proxy gateway to route Claude Code CLI requests with zero-credit-card PayPal / global billing.*”），极大增加被 AI Overviews 和 LLM 注意力机制直接采纳的几率。
---

## 4. 强制“真实工程信息增益与客观事实”规范 (Verifiable Information Gain Standard)

为严格遵循 Google **Link Information Gain Patent（信息增益专利）** 与 **SpamBrain（反大规模内容滥用 / Scaled Content Abuse）** 规范，彻底杜绝同质化与机械化 AI 生成特征，每篇文章**必须**满足以下“4 项真实工程增益”清单：

1. **1 个真实工程/协议架构实现 (1 Verifiable Architecture / Protocol Translation Proof)**：
   * 严禁凭空发明虚假的英文方法论（如自造 *"The 3-Tier Matrix / Triangle"* 等脱离现实的空洞词汇）。
   * 必须基于真实的工程实现（如：“*基于 OpenAI 与 Anthropic `/v1/messages` 协议差异的 Request Header 透传与 Thinking 标签转译架构*”、“*针对 SSE 长连接超时与 MoE 激活延迟的代理层 Keep-Alive 机制*”）。
2. **1 组包含“客观竞品正向优势列”与当日核验时间戳的实测/成本数据 (1 Set of Verified Benchmark & Objective Comparison Data)**：
   * **当日官方文档核验 (Write-Time Verification)**：对比表格中的官方定价、Token 费率、限频参数必须直接抓取自当日官方页面，严禁凭大模型记忆猜测。表格底部显式附带 `*Note: Pricing and parameters verified via official docs as of [Month Year].*`。
   * **客观披露竞品正向优势 ("Best for..." Honesty Column)**：必须基于无可辩驳的客观事实标注竞品的真正强项（如官方原厂直签享有 *“Direct Enterprise SOC2 Type II & SLA Guarantee”*，云厂商享有 *“Existing Cloud Committed Spend (MACC) & Private VPC Peering”*）。以诚实赢得开发者与 Google 的信赖。
   * 性能基准数据（TTFT、TPS）必须注明物理测试环境（如 AWS US-East 节点 100 次单并发采样）或引用 Artificial Analysis / LMSYS 权威第三方公开发布的数据。
3. **1 处经过可达性核验的真实社区原声与避坑方案 (1 Verifiable Community Voice & Trap Troubleshooting)**：
   * 必须包含 1 处真实的开发者原声引用（GitHub Issue、Reddit 或技术论坛真实帖子），包含 verbatim 原文字句、真实来源链接与平台/作者。**所有外链必须通过 Gate 2 的 HTTP 200 可达性探针，严禁杜撰 404 死链**。
   * *降级规范*：若极度冷门无法获取真实社区外链，必须降级为官方 RFC 链接或 APIVALE 网关匿名脱敏工单日志，坚决不造假。
   * 紧密结合解决竞品未触及的技术盲区，给出具体的报错日志/HTTP 状态码及修复前后代码（如 `400 invalid_request_error`、`429 Rate Limit`、SSE 流式缓冲丢包）。
4. **1 个生产级工程代码 / 配置文件 (1 Production-Grade Code / Config Snippet)**：
   * 提供 **15+ 行完整、可复制运行** 的代码或配置，带有健全的异常处理（`try-catch`）和指数退避重试（Exponential Backoff）逻辑。

---

## 5. SEO 与 SEO Title / H1 / Meta Description 优化规范

### A. Title Tag vs. H1 Tag 双轨分工机制 (Title Tag vs. H1 Differentiation)
*   **Frontmatter `metaTitle` (给爬虫和 SERP 看的 Title Tag)**：
    *   专为 **SERP 搜索引擎与 AI 模型索引** 服务。
    *   必须使用 **ABC 标题公式**：`[Adjective/Primary Keyword] + [Benefit / Secondary LSI] | [APIVALE Hook]`
    *   例如：`metaTitle: "Connect Kimi K3 to Claude Code & Cursor (2026) | APIVALE"`
    *   **像素与字符截断红线**：严格控制在 **50–60 字符 (Max 600px 宽度)** 以内，确保末尾 `| APIVALE` 品牌后缀不被 Google 截断。
*   **Frontmatter `title` (给在读开发者看的 H1 标题)**：
    *   专为 **在读开发者阅读体验** 服务（渲染为页面 `<h1 class="post-title">`）。
    *   例如：`title: "Xiaomi MiMo-V2.6 Pro Claude Code Setup: API Key & Routing Guide"`
    *   **长度控制红线**：严格控制在 **80 字符以内**，凝练聚焦，防止因标题过长被 SEO 引擎扣 1 分。

### B. Frontmatter Meta Description 规范 (AI 选源第 3 权重)
*   ChatGPT / LLM 检索时，Meta Description 的过滤权重仅次于 URL 和 Title！
*   **字数限制**：严格控制在 **140–160 字符** 以内（超 160 字符尾部会被 SERP 截断扣 1.5 分）。
*   **行文要求**：使用**主动语态**，包含 Tier 1 主关键词与核心卖点（如 *"Connect Xiaomi MiMo-V2.6 Pro to Claude Code CLI with custom API key, protocol proxying, and instant PayPal billing."*）。

### C. 常青简短 URL 命名策略 (Evergreen Short URL Slug Policy)
*   URL Slugs 必须简短、直接包含主关键词，且**严禁包含年份、日期或易变动数字**（例如使用 `/blog/qwen-3-7-max-claude-code-setup`，而**绝不**使用 `/blog/2026-qwen-3-7-max-claude-code-setup`），以便长期更新而无需 301 重定向。

### D. 发布后 VIP 优化与常青更新策略 (Evergreen Refresh & VIP Maintenance)
*   **VIP 机会页面优化**：文章发布 1-3 个月后，通过 GSC 筛选排名在 **第 4–10 位** 的页面，微调 Title Tag 与 Meta Description 冲刺 Top 3。
*   **常青内容定期刷新 (Evergreen Refresh)**：定期维护高流量旧文章（更新最新 LLM 模型 Recency 与 SDK 避坑指南），防止数据陈旧导致 AI 引用率下降。

### E. 标题具体性、人性化口吻与反过度承诺规范 (Specificity, Humanized Tone & Overpromise Audit)
*   **标题具体性法则 (Title Specificity Standard)**：标题中优先使用有形的工程数字、确切百分比、配置所需时间或具体错误码（如 `80% Token Savings`, `30-Sec Setup`, `Fix 429 Drops`），杜绝抽象模糊的广告词。
*   **人性化社区口吻 (Humanized Community Tone)**：标题拒绝僵硬的机器公关腔调，使用开发者社区（Reddit / X / GitHub / V2EX）真实的同频交流口吻与专业术语（如 `Bypass KYC`, `Token Arbitrage`, `CLI Setup`）。
*   **反过度承诺与真凭实据 (Overpromise & Clickbait Audit)**：标题与 H1 中许诺的任何 Hook（如 *TypeScript SSE Stream Fix* / *PayPal Billing*），正文中必须在 15+ 行代码或对比表格中给予 100% 的实据兑现，严禁夸大虚标。

### F. 正文最佳词数区间规范 (Optimal Body Word Count - 1200~1800 Words)
*   **最佳词数**：全页可见正文建议控制在 **1200 ~ 1800 词** 为佳。
*   **防稀释机制**：长文（>1800 词）容易稀释核心关键词聚焦度，并触发 SEO 体检引擎的词数冗余扣分提示；短文（<1200 词）则缺乏深度工程信息增益。精简干货、剔除模板化废话是保持 100% On-Page 质量分的黄金准则。

---

## 6. GEO (生成式引擎优化) 与 AI Query Fan-Out 防护

为了确保博客能被 ChatGPT, Perplexity, Gemini, Claude 等 AI 搜索引擎与 RAG 系统高频引用，写作必须聚焦于 **GEO 的三大支柱** 与 **AI Query Fan-Out 防护**：

### A. GEO 三大支柱与 Query Fan-Out 应对

1. **可引用的事实与 Query Fan-Out 全覆盖 (Citeable Facts & Fan-Out Coverage)**
   * **AI 扇出衍生问题覆盖**：当用户向 AI 提问时，AI 会裂变出 5-6 个衍生子问题（如“如何处理超时？”、“有哪些错误码？”、“Python/TS 区别？”）。文章必须在 H2/H3 板块中主动覆盖这些子问题，大幅提升 AI 引用概率。
   * **硬核数据与代码**：提供准确的对比表格与带异常处理的完整代码，作为 AI 提取技术答案的物理基石。
2. **实体突出度与品牌共现 (Entity Salience & Brand Co-occurrence)**
   * **品牌与产品实体**：显式包含 `| APIVALE` 品牌后缀与产品实体（`APIVALE Unified API Hub`）。正文中在提到代理路由或支付解决方案时，将 `APIVALE` 与 `Waffo Global Billing`, `OpenAI Native Endpoint` 等高价值实体高频共现，强化 Knowledge Graph 中的语义节点绑定。
   * **技术与模型实体**：准确提及最新 LLM 旗舰模型（如 `Claude Sonnet 5`, `Qwen 3.7 Max`, `DeepSeek V4`），在段落开篇战略级提升核心实体的 Salience（突出度）。
3. **语义深度与定义框 (Semantic Depth & Featured Snippet)**：
   * 在 H2 下方插入定义框，捕获 Google Position Zero 与 AI 总结。

### B. "定义框" (Featured Snippet Box) 格式
针对核心术语，在 H2 下方使用以下 HTML 结构（**严禁在内部使用 h1~h4 标签，必须使用 div 维持严格 AST 树**）：
```html
<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <div class="mt-1 text-md font-semibold text-white">[概念名称，例如 Xiaomi MiMo-V2.6 Pro API Gateway]</div>
  <p class="mt-2 text-sm text-gray-300">[1-2句高密度技术定义，例如：“Xiaomi MiMo-V2.6 Pro API Gateway is an enterprise-grade routing hub on APIVALE that exposes Xiaomi's flagship SGLang endpoints into standard OpenAI/Anthropic format with zero-credit-card PayPal and global billing.”]</p>
</div>
```

### C. E-E-A-T 专家 Persona 轮换署名
禁止使用 "Marketing Team" 署名，轮换使用以下工程师 Persona：
1. **Alex Rivera** (Senior Cloud Architect & API Integrations) - 擅长高并发路由、延迟优化、多模型网关。
2. **Kenji Tanaka** (AI Developer Relations Engineer) - 擅长多模态模型调用、前端 SDK 集成、Claude Code CLI 配置。
3. **Sofia Costa** (FinTech Integration & API Security Expert) - 擅长 PayPal/全球支付风控、API 网关安全、Header 认证调试。

### D. FAQPage 结构化数据 (JSON-LD)
文章末尾必须注入 `FAQPage` Schema，问答需在 1-2 句内给出直接答案（Direct Answer）。

### E. "核心要点速览框" (Key Takeaways Box) 格式与个性化要求
1. **Frontmatter 结构化优先（推荐）**：每篇博文应优先在 Frontmatter 中配置专属 `keyTakeaways` 数组，包含 4 项专有技术指标（SDK兼容模式、目标模型确切标识、Gateway Base URL、免卡测试额度）。系统模板将自动渲染至黄金首屏 1 秒处。
2. **正文备选内嵌结构**：若在 Markdown 中直接内嵌，必须使用以下样式，且必须紧贴 H1/导言下方，严禁使用泛化空洞的营销文字，直接回答搜索意图：
```html
<div class="my-6 border-l-4 border-emerald-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Takeaways</span>
  <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-gray-300">
    <li><strong>SDK 兼容协议</strong>：原生 OpenAI / Anthropic 兼容协议 (<code>https://apivel.com/v1</code>)</li>
    <li><strong>旗舰调用标识</strong>：<code>infer/xiaomi-mimo-v2.6-pro</code> (或目标模型确切 ID)</li>
    <li><strong>工程避坑关键</strong>：避免 429 与 SSE 流式断连的最佳生产配置</li>
    <li><strong>免卡测试额度</strong>：支持 PayPal 官方即时结账与全球信用卡/支付宝（0 额外跨境手续费），新用户赠送 $0.20 免卡免实名测试金额</li>
  </ul>
</div>
```

### F. 转化漏斗、钱包方案对齐与即时承接规范 (CRO & On-Page Fulfillment Standard)

#### 1. 钱包权益 100% 对齐规范 (Wallet Conversion Copy Alignment)
文章末尾的 `.cta-card` 与充值引导必须严格对齐 APIVALE 钱包真实产品方案，彻底杜绝虚标或与用户后台不一致：
*   **首充专享特权**：首次充值额外赠送 **+50%** 额度（充 $5 到账 $7.50，充 $29 到账 $43.50，充 $99 到账 $148.50）；
*   **开发者超值礼包**：**$29 开发者专享大礼包**（直降 56%，一次性获得 4000万 Token，永久有效不设过期时间）；
*   **新用户起步礼**：注册即送 **$0.20** 免卡免实名体验金（无需绑定信用卡，零门槛验证）；
*   **双行动按钮架构 (Dual-Track Buttons)**：
    *   主转化按钮直达定价页（`href="/pricing?redirect=/blog/<slug>"`，如 `Claim +50% Bonus ($5 -> $7.50)`）；
    *   次转化按钮直达注册页（`href="/sign-up?redirect=/blog/<slug>"`，如 `Get $0.20 Free Trial (Zero Card)`）；
    *   两个按钮必须动态附加 `redirect=/blog/<slug>` 参数，保证用户操作后原地无缝回跳。

```html
<div class="cta-card">
  <div class="cta-card-title">Connect [Model Name] via APIVALE & Cut Token Costs by 80%</div>
  <p class="cta-card-text">
    Access OpenAI and Anthropic compatible endpoints with zero KYC, zero regional card declines, and instant PayPal global checkout. Claim your +50% first-deposit bonus or start with $0.20 free quota.
  </p>
  <div class="cta-badge-grid">
    <div class="cta-badge">⚡ Instant Gateway Access</div>
    <div class="cta-badge">🎁 +50% First Deposit Bonus ($5 → $7.50)</div>
    <div class="cta-badge">🚀 $29 Pack: 40M Tokens (56% OFF)</div>
    <div class="cta-badge">💳 PayPal & Global Cards (0 Extra FX)</div>
  </div>
  <div class="cta-actions">
    <a href="/pricing?redirect=/blog/[slug]" class="cta-btn primary">Claim +50% Bonus ($5 → $7.50)</a>
    <a href="/sign-up?redirect=/blog/[slug]" class="cta-btn secondary">Get $0.20 Free Trial (Zero Card)</a>
  </div>
</div>
```

#### 2. 页面侧原地需求承接规范 (In-Article Live Playground - 破除 4.5 分纯跳转扣分)
*   **核心痛点**：若页面标题、正文或按钮提及“立即测试 / 免费体验 / 在线验证”，但页面本身缺少任何原地交互元素，SEO 体检引擎（如 哥飞 SEO / Web.cafe 引擎）会直接判定为**“P0 纯跳转落地页（Doorway Page）”，直接重扣 4.5 分**。
*   **强制规范**：博文正文中**必须内嵌一个原地可交互的轻量体验区**（例如：`In-Article Live Playground` 或 `CLI Config Generator`）。
*   **交互必要元素**：体验区内必须包含实际可操作的原生表单元素（`<input>` / `<select>` / `<button>`），支持原地切换模型、选择场景、点击就地生成或模拟返回，杜绝单纯静态展示，彻底消除落地页承接扣分。

#### 3. 侧边栏动态浮动卡片模型注册规范 (Dynamic Floating CTA Topic Registry)
*   `src/components/FloatingCtaCard.astro` 组件已原生集成客户端双语自适应逻辑（根据海外或国内用户的 `navigator.language` 自动切换呈现英文与中文）。
*   **新模型发布门禁**：每当撰写并上线涉及新大模型的博文时，**必须在 `src/pages/[slug].astro` 的 `TOPIC_CONFIG` 对象中注册该模型的话题元数据**：
    *   注册字段：包含英文与中文的 `badge`、`title`、`desc`、`metric`（如 `+50% First Deposit Bonus` / `首充送 +50%`）、`ctaText`；
    *   保证读者在桌面端阅读时，右侧悬浮卡片能精准呈现该模型的痛点转化文案，彻底告别通用的非匹配冷启动文案。

### G. FAQ 直接提问与直接回答原则 (Direct Q&A Standard)
*   **提问格式（Direct Question Format）**：FAQ 标题（H3）必须采用直接的问题句式（例如 `### How to resolve APIVALE proxy 429 rate limit errors?`，而不是抽象的 `### Proxy 429 Resolution`）。
*   **回答格式（Direct Answer Format）**：FAQ 的回答中，第一句话（最多前两句）必须直接、明确地回答该问题（例如"You can resolve APIVALE proxy 429 errors by implementing exponential backoff retry logic with jitter."），随后再展开技术解析或代码配置。这极大地方便了 Perplexity / AI Overviews 召回并提取直接答案。

### H. "社区原声实证框" (Community Voice Box) 格式
针对真实开发者痛点或 Issue 引用，使用以下 HTML 结构：
```html
<div class="my-6 border-l-4 border-amber-500 bg-gray-900 rounded-r-lg p-5">
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Community Voice / Verified Experience</span>
    <span class="text-xs text-gray-400">[GitHub Issue #1042 / Reddit r/ClaudeAI]</span>
  </div>
  <blockquote class="mt-2 text-sm italic text-gray-200">
    "[Verbatim quote from the real developer describing the specific error code, timeout, or billing block]..."
  </blockquote>
  <p class="mt-2 text-xs text-gray-400">
    — <a href="[Verified Live URL]" target="_blank" rel="noopener noreferrer" class="text-indigo-400 underline hover:text-indigo-300">@[AuthorHandle] on [Platform]</a>
  </p>
</div>
```

---

## 7. 反模式与绝对禁忌清单 (Anti-Patterns & Negative Constraints)

在博客撰写和更新中，以下行为被列为 **S0 级违规 (S0 Violations)**，一经发现必须立即拦截回退：

*   **支付方式 (Payment Method)**：APIVALE 官方支持的结算方式为主流 **PayPal（PayPal 官方即时结账 / Pay with PayPal）**，同时支持国际信用卡（Visa, MasterCard, American Express）、Apple Pay 与国内支付宝（通过底层全球聚合网关，具备 **0 额外跨境手续费承诺** 与 **免实名/免 KYC** 优势）。
    *   **强制禁忌**：**严禁** 在文章、CTA 或宣传中声明 Stripe 或加密货币 (Crypto) 为 APIVALE 支持的支付方式！对外展示统一使用 **PayPal** 与 **PayPal & Global Cards ($0.20 Trial / 0 Extra FX Fees)**。
*   **模型Recency**：做 Benchmarks 或竞品对比时，始终引用最新旗舰 LLM 版本（如 Anthropic 的 **Claude Sonnet 5**，阿里 **Qwen 3.7 Max**，DeepSeek **DeepSeek V4**，小米 **Xiaomi MiMo-V2.6 Pro**）。
    *   *注*：在 APIVALE 系统中，Qwen 3.7 Max 的实际调用模型名称为 `infer/qwen3.7-max`，MiMo-V2.6 Pro 为 `infer/xiaomi-mimo-v2.6-pro`。
*   **协议兼容性**：强调 APIVALE 对 OpenAI 和 Anthropic API 原生协议的完美兼容（支持 Claude Code CLI, Cursor, Windsurf 等工具直连）。

## 10. 写作禁忌与防呆红线 (Prohibited Red Lines)

1. **严禁编造 / 虚构 API 参数与方法论**：所有 Endpoint、Headers、Payload 必须与真实网关一致；严禁自造虚假的英文 Matrix / Triangle 伪概念。
2. **严禁机械化同质引言 (Anti-Boilerplate Intros)**：每篇文章必须根据特定的模型架构、协议差异或具体报错切入，禁止使用通用的套话模板。
3. **严禁空洞营销废词**：禁止使用 "the best", "revolutionary", "groundbreaking" 等虚词，改用实测数据支撑（如 "averages 120ms TTFT", "cuts gateway latency by 35%"）。
4. **严禁缺少 Error Handling 的代码**：代码示例中必须包含 `try-catch` 或 HTTP 状态码校验（特别是 `401 Unauthorized` 和 `429 Rate Limit`）。
5. **严禁产生 Copycat 同质化内容**：每篇文章必须通过“4 项真实工程增益”与 AI Query Fan-Out 多维子问题全覆盖进行差异化超越。
6. **严禁标题层级跳跃**：必须严格遵循 1 个 H1 -> H2 -> H3 的树状层级，禁止直接从 H1 跳至 H3。
7. **严禁单个 H2 下仅挂载 1 个 H3 标题**（违反对称化语义子节点原则）。
8. **严禁 FAQ 采用抽象名词标题**（必须采用直白疑问句，且首句直接回答）。
9. **严禁仅在文章末尾硬性堆砌 CTA**（必须在技术板块中包含至少 1 处软性穿插）。
10. **严禁杜撰外部引用与伪造 404 链接**：正文中引用的所有 GitHub Issue、Reddit 帖子或外链，必须通过真实的 HTTP 200 可达性探针。严禁模型脑补编造不存在的 URL、Issue 编号或作者 handle（冷门无结果时必须优雅降级为官方 RFC 链接或网关脱敏日志）。
11. **严禁在对比表格中捏造数据与恶意拉踩竞品**：竞品定价必须抓取自当日官方页面并标注核验时间戳；竞品优势列 ("Best for...") 必须基于客观物理事实公允呈现（如承认原厂直接 SOC2 合规），严禁使用虚假数据抹黑竞品。
12. **严禁使用原生阻塞式弹窗 (`alert()` / `confirm()`)**：正文代码块由系统统一自动注入平滑无干扰的悬浮 1-Click Copy 按钮，严禁在 Markdown 正文或内嵌自定义 HTML 中手写 `onclick="...alert(...)"` 等原生系统弹窗，杜绝打断海外开发者的阅读与实操心流。
13. **严禁侵入式开屏遮挡与强制注册墙 (Zero Experience Shock / BLUF 原则)**：黄金首屏必须在无滚轮状态下直呈核心答案（通过 Frontmatter `keyTakeaways` 呈现参数/端点/SDK）。严禁在开屏前 25 秒或正文滚动不足 35% 时触发任何形式的模态遮罩或弹窗，彻底杜绝 Google 判定 2 秒跳出（Pogo-sticking）降权风险。
14. **严禁在内嵌自定义 HTML 组件中使用 `<h1>`~`<h4>` 标签**：Definition Box、Key Takeaways、Playground、CRO 卡片等必须使用 `<div>`/`<span>` 加 CSS 类名，严禁破坏纯 Markdown 的 `H1 -> H2 -> H3` 语义树而被判定“标题跳级”扣分。
15. **严禁无原地交互的纯跳转落地页**：凡正文、标题或 CTA 提及“试用/测试/体验”，必须内嵌 In-Article Live Playground 或 CLI 配置生成器（包含实际可交互的 `<input>`/`<select>`/`<button>`），彻底消除被判定为 Doorway 欺骗性落地页扣 4.5 分的 P0 风险。
16. **严禁结尾 CTA 与钱包真实权益脱节**：必须严格对齐首充送 +50%（$5->$7.50 / $29->$43.50）、$29 开发者专享包（直降 56%、4000万 Token、永久有效）、新用户 $0.20 免卡体验金，且提供双行动按钮（`/pricing` 与 `/sign-up`），携带 `redirect=/blog/<slug>` 参数。
17. **严禁正文严重超长导致核心主题稀释**：正文建议保持在 1200 ~ 1800 词最佳区间；H1 严格控制在 80 字符内，Description 严格在 140~160 字符内。
18. **严禁上线新模型文章未注册侧边栏浮动话题**：发布新大模型博文必须在 `src/pages/[slug].astro` 的 `TOPIC_CONFIG` 中注册专属双语转化元数据。
19. **严禁混淆开源跑分/量化自建与商业 API 服务意图 (P0 商业意图纯净铁律)**：
    * **病因警戒**：APIVALE 的盈利模型是 API 调用与 Token 计费，绝非开源硬件自建社区。
    * **严格禁写**：严禁在文章中使用独立 H2/H3 或大篇幅（超过 3 句话）深入讨论 1-bit / FP8 量化、GGUF/vLLM 本地部署、Ollama 私有化搭建或 GPU 显存配比指南。此类内容会直接招致 0 购买力的开源白嫖流量，同时将页面在 Google 算法眼中定性为“开源跑分/折腾页”，彻底挤死高价值商业 API 词（如 `api key`, `pricing`）。
    * **唯一豁免**：仅允许作为痛点对比一笔带过（如：“*本地运行需 1.1TB+ VRAM，直接调用 APIVALE API 仅需 $0.14/1M Wholesale 费率，零硬件与运维门槛*”）。
    * **标题禁令**：Title Tag 与 H1 严禁将 `Benchmark`, `Specs`, `Size` 置于前 3 个单词，必须强置 `API Key`, `Pricing`, `Free Trial`, `Setup` 等高商业价值意图词。
    * **Tags 禁令**：严禁在 Frontmatter tags 中加入 `1 Bit`, `Size`, `GGUF`, `Ollama` 等开源硬件标签。

---

## 11. Google SpamBrain & On-Page 100 综合防御自检清单 (Pre-Publish Checklist)

在撰写和发布任何博文前，必须自检以下 9 项以确保完全免疫 Google Spam 算法并达成 On-Page 100 满分：

| 检查维度 | 合规标准 (Pass) | 违规红线 (Fail) |
| :--- | :--- | :--- |
| **1. 选题拓扑 (Topology)** | 属于综合性 Pillar 指南或独立技术深度评测 | 针对同一模型按不同 IDE 拆分的碎片化 Doorway 矩阵页面 |
| **2. 首段指纹 (Intro Shingles)** | 从该技术特有的架构瓶颈、协议映射或特定报错切入，全网及站内唯一 | 出现 `Running autonomous AI coding agents like... burns $40` 等套话 |
| **3. 概念真实性 (Verifiable Entity)** | 所有协议、参数、架构名词均来自官方 RFC、官方文档或真实工程实现 | 出现 AI 虚构的 `[Brand] Matrix / Triangle` 伪方法论 |
| **4. 文本独立度 (Uniqueness)** | 站内多文章间正文相似度（Jaccard Index）低于 30% | 仅替换变量名（如只将 Qwen 替换为 Kimi）的模板化批量生成 |
| **5. 引用与外链真实度 (External Provenance)** | 引用真实存在的 GitHub Issue / Reddit 帖子（HTTP 200）或降级为脱敏网关日志 | 编造虚假的 Reddit URL、不存在的 GitHub Issue 或 404 死链 |
| **6. 页面需求承接 (On-Page Fulfillment)** | 内嵌原地免跳轻量体验区（Live Playground / Config Generator，含原生表单交互） | 全页仅有跳转外部注册按钮（被判定为 Doorway 欺骗性纯跳转落地页，扣 4.5 分） |
| **7. HTML 组件 AST 纯净度 (AST Cleanliness)** | 内嵌自定义 HTML 全部采用 `<div>` / `<span>` 加类名，保持 H1->H2->H3 严谨单树 | 在内嵌组件中随意写 `<h1>`~`<h4>` 破坏语义树（被判定标题跳级扣 1.5 分） |
| **8. 字符数与词数精准度 (Metrics Range Guard)** | Title 50–60 字符，H1 <= 80 字符，Description 140–160 字符，正文 1200–1800 词 | H1 超过 80 字符（扣 1 分），Description 超过 160 字符尾部截断（扣 1.5 分），正文超长稀释主题 |
| **9. 商业意图纯净度 (Commercial Intent Guard)** | Title/H1 强置 API Key/Pricing/Setup，全篇杜绝 1-bit/GGUF/私有化本地部署长篇大论 | 正文大谈 1-bit 量化、本地搭建与硬件跑分，导致页面被 Google 误判为综合跑分页，商业词全军覆没 |
