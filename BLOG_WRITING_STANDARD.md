# APIVALE 技术博客写作与 SEO/GEO 优化标准 (Master Blog Writing & SEO/GEO Standard)

本文档是 `apivale.com` 技术博客规范的 **唯一事实来源 (Single Source of Truth, SSOT)**。无论是人类技术编辑、开发者，还是 AI 写作 Agent（如 Antigravity, Claude Code, Cursor），在撰写、审阅或更新任何 APIVALE 博客文章时，均**必须严格遵循**本文档的规范。

---

## 1. 定位与受众策略 (Target Audience & Positioning)

针对 APIVALE 的受众特点（Developers, AI Engineers, Technical Founders, CTOs），文章定位强调**干货密集、工程可落地、权威实测与高性价比 API 解决方案**。

| 维度 | 传统工业/商业博客 | APIVALE 开发者技术博客标准 (本项目) |
| :--- | :--- | :--- |
| **受众定位** | 传统企业决策者（偏重商业 ROI 与政策） | 开发者、独立创作者、AI 工程师、CTO（偏重技术实现、成本与可靠性） |
| **文章字数** | 2500 - 3500 词 | **1500 - 2500 词**（包含可运行代码与数学推算，行文高效直接、无废话） |
| **核心卖点** | 概念灌输、宏观趋势 | **PayPal 全球快捷支付、免实名、免+86手机号、100% 官方代理路由、低延迟高并发** |
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
│ Step 2: SERP Competitor 3C & Topic Drill-Down Audit   │
│ 3C 意图诊断 -> 竞品框架保底 -> 分级主题下钻 Content Gap│
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Step 3: Outranking Strategy & "4 Ones" Architecture    │
│ 倒金字塔大纲 -> PAS 引言 -> 独特性 4 个 1 -> ABC Title  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Step 4: Drafting, AI Peer Review & Compliance Check    │
│ Markdown 撰写 -> DevOps 逻辑自审 -> DevServer 验证提交   │
└────────────────────────────────────────────────────────┘
```

### Step 1: 目标关键词选取与父级主题校验 (Parent Topic & Entity Audit)
- 查阅 `KEYWORD_PLAN.md` 确定目标关键词。
- **父级主题与辅助词校验 (Parent Topic & Secondary LSI Audit)**：
  - 验证目标关键词是否挂载在搜索量最大的父级主题下（例如搜索 `qwen 3.7 max api` 时，确认父级主题是否为 `qwen 3.7 max claude code setup`）。以父级主题为 Primary Target 才能获得最大流量上限。
  - 提取 1-2 个竞争对手共享的高频次要关键词（Secondary LSI），自然融入 Title Tag 和 H2/H3 小标题。
- **实体-概念网络设计 (Entity-Relationship Network Audit)**：
  - 明确文章包含的 **3-5 个核心实体链 (Entity Chains)**（例如：`APIVALE Router` $\rightarrow$ `OpenAI SDK Protocol` $\rightarrow$ `Claude Code CLI` $\rightarrow$ `PayPal Billing`）。确保正文中核心实体及其强关联概念自然共现，构建高密度实体图谱。

### Step 2: SERP 竞品检索、3C 诊断与分级主题下钻 (Top 5 Competitors & Topic Drill-Down Audit)
- 对目标关键词进行搜索引擎检索，获取排名 Top 5 的竞品页面，并读取全文/HTML。
- **搜索意图 3C 诊断 (Search Intent 3C Diagnosis)**：
  - **Content Type (内容类型)**：确认主导类型（Blog post, Landing page, Technical Documentation）。
  - **Content Format (内容格式)**：确认主导格式（How-To Tutorial, Listicle, Comparison Review, Deep-dive Guide）。文章**必须**与主流格式保持一致！
  - **Content Angle (切入视角)**：分析竞品切入角度（如 *"2026 Latest"*, *"Zero Credit Card"*），定义 APIVALE 的胜出切角（如 *"PayPal Billing + Multi-Gateway Fallback"*）。
- **分级主题下钻与技术缝隙挖掘 (Multi-Level Topic Drill-Down & Content Gap Mining)**：
  - 利用 SERP 顶部 Topic 胶囊按钮、Google Images 标签、搜索框下拉建议与 PAA 进行 2-3 层逐层点击下钻（Drill-Down）：
    - **一级主题 (Topic 1 - 大类维度)**：搜主词出的第一排标签（如竞品 `Claude Opus` / `DeepSeek V4`、场景 `Coding`），决定文章 H2 核心逻辑模块。
    - **二级主题 (Topic 2 - 细分板块)**：点击一级标签后刷新出的子标签（如点击 `Coding` 刷出 `Claude Code` / `Rate Limit`），决定 H3 支撑层级。
    - **三级主题 (Topic 3 - 硬核细节)**：再次下钻刷出的细节（如 `base_url` / `429 Error`），决定 15+ 行代码示例与避坑解决方案。
- **双轨组合拳原则 (Baseline vs. Outranking Rule)**：
  - **Top 5 竞品 3C 诊断 = 保底线 (Baseline)**：决定文章格式与基础骨架，确保符合 Google 已认可的搜索意图，拿到进入前 10 名的门票。
  - **分级主题下钻 = 冲第一 (Outranking)**：挖出竞品未触及的技术盲区 (Content Gap)，赋予文章极高的**信息增益 (Information Gain)** 和 GEO 引用率。

### Step 3: 超越策略与“独特性 4 个 1”架构设计 (Outranking Strategy)
- 制定 3 层关键词架构（Tier 1 主词在 Title/H1/前100字；Tier 2 LSI 词在 H2/H3；Tier 3 品牌与竞品词在正文）。
- 落地 **PAS 引言公式**（Problem 痛点 -> Agitate 放大痛苦 -> Solve 引入 APIVALE 方案）。
- 落地 **E-E-A-T 权威锚点**（如 *"基于 APIVALE 生产网关 10,000+ 次 API Agent 调用的实测数据..."*）。
- 落地 **独特性“4 个 1”规范**（详见第 4 节）。

### Step 4: 撰写、AI 同行自审与合规验证 (Drafting & Review Loop)
- 在 `src/content/blog/<article-slug>.md` 撰写 Markdown 文件。
- **AI 同行自审机制 (AI Peer Review Loop)**：以高级 DevOps / 架构师视角自审代码可运行性、逻辑严密性与语言流畅度，杜绝机械化 AI 腔调。
- 启动 dev server 验证渲染表现 (`http://localhost:4321/blog/...`)，确认无误后提交 git 仓库。

---

## 3. 文章结构与 H 标签语义树标准 (Article Structure & AST Tree)

每篇技术文章必须严格遵循倒金字塔大纲结构与树状 H 标签语法层级，确保读者与 LLM AST 语法分析器能够精准解析。

```
├── 1. Title Tag & H1 (双轨分工, ABC 标题公式, 50-60字符 cap)
├── 2. Frontmatter Description (140-160字符, AI 引用第3权重摘要)
├── 3. PAS Introduction (痛点陈述 + E-E-A-T 锚点 + 可运行的最简 cURL 代码示例)
├── 4. Defined Snippet Box (定义框：捕捉 Position Zero 精选摘要)
├── 5. Comparison Table (前 20% 处：价格、限频、支持模型的硬核对比)
├── 6. Technical Modules (2-3个 H2/H3 核心板块，回答 AI Query Fan-Out 衍生子问题)
├── 7. Developer FAQ (针对 AI GEO 抓取的 3-4 个精炼技术问答)
├── 8. Schema JSON-LD (FAQPage 结构化数据)
└── 9. CTA Module (开发者导向：PayPal 快捷充值、API Key 免费创建)
```

### H 标签语义树排版红线 (Heading AST Hierarchy)
*   **唯一 `<h1>`**：每篇文章只能有 **1 个 H1**（即 Frontmatter 中的 `title` 或 Markdown 顶部的 `# Title`）。
*   **论点层级 (`<h2>`)**：`<h2>` 用于划分核心逻辑模块（如环境搭建、代码实现、踩坑解决、价格对比）。
*   **支持层级 (`<h3>`)**：`<h3>` 用于放置支撑 H2 的具体步骤、语言分支（Python/TS）或示例。
*   **禁止跨级跳跃**：**严禁直接从 H1 跳到 H3**，必须严格按照 H1 -> H2 -> H3 逐层递进，确保 LLM 爬虫快速构建文章层级图谱。
*   **陈述句首写与单语义消歧原则 (Declarative & Monosemanticity Rule)**：每个 H2/H3 小标题下方的**第一句话**必须使用直接、明确的陈述句概括核心结论，同时消除多义词歧义（Monosemanticity）。必须明确写出【动作 + 核心实体 + 具体技术上下文】（例如：“*Configure APIVALE's OpenAI-compatible proxy gateway to route Claude Code CLI requests with zero-credit-card PayPal billing.*”），极大增加被 AI Overviews 和 LLM 注意力机制直接采纳的几率。

---

## 4. 强制“独特性 4 个 1”规范 (Information Gain Standard)

为遵循 Google **Link Information Gain Patent（信息增益专利）**，避免产生同质化山寨内容，每篇文章**必须**满足以下“4 个 1”独特性清单：

1. **1 个独家提炼的方法论 / 命名公式 (1 Branded Methodology / Named Formula)**：
   * 提炼一个具有 APIVALE 品牌属性的方法论或计算框架（如 *"The 3-Tier Token Thinning Matrix"*, *"The Multi-Gateway Fallback Triangle"*），方便他人引用。
2. **1 组真实工程实测 / 成本推算数据 (1 Set of Real Benchmark / Calculated Data)**：
   * 包含真实的 TTFT (首字延迟)、延迟分布或确定性 scenario 的数学成本推算表（数据可由 AI 运行测试脚本或确定性数学模型生成）。
3. **1 个竞品未触及的高级踩坑解决方案 (1 Edge-Case & Hidden Trap Solution)**：
   * 解决 Top 5 竞品忽略的技术盲区（如代理 Header 冲突、SSE 流式缓冲断连、Context 剪裁掉包、高并发 RPM 突破排查）。
4. **1 个生产级工程代码 / 配置文件 (1 Production-Grade Code / Config Snippet)**：
   * 提供 **15+ 行完整、可复制运行** 的代码或配置，带有健全的异常处理（`try-catch`）和指数退避重试（Exponential Backoff）逻辑。

> [!TIP]
> **RAG 向量召回率优化 (Vector Distance & RAG Optimization)**：硬核工程数据与带错误排查（401/429）的代码片段在 RAG 系统的向量空间（Embedding Vector Space）中，与真实开发者的具体搜索 Query 距离最近（高余弦相似度 Cosine Similarity），是确保文章被 ChatGPT/Perplexity 召回为参考源的物理基石。

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
    *   例如：`title: "How to Connect Kimi K3 to Claude Code CLI & Cursor IDE (2026 Guide + PayPal Billing)"`
    *   侧重技术严谨度与完整主题描述，不受 60 字符或品牌后缀限制。

### B. Frontmatter Meta Description 规范 (AI 选源第 3 权重)
*   ChatGPT / LLM 检索时，Meta Description 的过滤权重仅次于 URL 和 Title！
*   **字数限制**：严格控制在 **140–160 字符** 以内。
*   **行文要求**：使用**主动语态**，包含 Tier 1 主关键词与核心卖点（如 *"Learn how to connect Qwen 3.7 Max to Claude Code CLI with zero credit card via APIVALE PayPal billing..."*）。

### C. 常青简短 URL 命名策略 (Evergreen Short URL Slug Policy)
*   URL Slugs 必须简短、直接包含主关键词，且**严禁包含年份、日期或易变动数字**（例如使用 `/blog/qwen-3-7-max-claude-code-setup`，而**绝不**使用 `/blog/2026-qwen-3-7-max-claude-code-setup`），以便长期更新而无需 301 重定向。

### D. 发布后 VIP 优化与常青更新策略 (Evergreen Refresh & VIP Maintenance)
*   **VIP 机会页面优化**：文章发布 1-3 个月后，通过 GSC 筛选排名在 **第 4–10 位** 的页面，微调 Title Tag 与 Meta Description 冲刺 Top 3。
*   **常青内容定期刷新 (Evergreen Refresh)**：定期维护高流量旧文章（更新最新 LLM 模型 Recency 与 SDK 避坑指南），防止数据陈旧导致 AI 引用率下降。

### E. 标题具体性、人性化口吻与反过度承诺规范 (Specificity, Humanized Tone & Overpromise Audit)
*   **标题具体性法则 (Title Specificity Standard)**：标题中优先使用有形的工程数字、确切百分比、配置所需时间或具体错误码（如 `80% Token Savings`, `30-Sec Setup`, `Fix 429 Drops`），杜绝抽象模糊的广告词。
*   **人性化社区口吻 (Humanized Community Tone)**：标题拒绝僵硬的机器公关腔调，使用开发者社区（Reddit / X / GitHub / V2EX）真实的同频交流口吻与专业术语（如 `Bypass KYC`, `Token Arbitrage`, `CLI Setup`）。
*   **反过度承诺与真凭实据 (Overpromise & Clickbait Audit)**：标题与 H1 中许诺的任何 Hook（如 *TypeScript SSE Stream Fix* / *PayPal Billing*），正文中必须在 15+ 行代码或对比表格中给予 100% 的实据兑现，严禁夸大虚标。

---

## 6. GEO (生成式引擎优化) 与 AI Query Fan-Out 防护

为了确保博客能被 ChatGPT, Perplexity, Gemini, Claude 等 AI 搜索引擎与 RAG 系统高频引用，写作必须聚焦于 **GEO 的三大支柱** 与 **AI Query Fan-Out 防护**：

### A. GEO 三大支柱与 Query Fan-Out 应对

1. **可引用的事实与 Query Fan-Out 全覆盖 (Citeable Facts & Fan-Out Coverage)**
   * **AI 扇出衍生问题覆盖**：当用户向 AI 提问时，AI 会裂变出 5-6 个衍生子问题（如“如何处理超时？”、“有哪些错误码？”、“Python/TS 区别？”）。文章必须在 H2/H3 板块中主动覆盖这些子问题，大幅提升 AI 引用概率。
   * **硬核数据与代码**：提供准确的对比表格与带异常处理的完整代码，作为 AI 提取技术答案的物理基石。
2. **实体突出度与品牌共现 (Entity Salience & Brand Co-occurrence)**
   * **品牌与产品实体**：显式包含 `| APIVALE` 品牌后缀与产品实体（`APIVALE Unified API Hub`）。正文中在提到代理路由或支付解决方案时，将 `APIVALE` 与 `PayPal Global Billing`, `OpenAI Native Endpoint` 等高价值实体高频共现，强化 Knowledge Graph 中的语义节点绑定。
   * **技术与模型实体**：准确提及最新 LLM 旗舰模型（如 `Claude Sonnet 5`, `Qwen 3.7 Max`, `DeepSeek V4`），在段落开篇战略级提升核心实体的 Salience（突出度）。
3. **语义深度与定义框 (Semantic Depth & Featured Snippet)**：
   * 在 H2 下方插入定义框，捕获 Google Position Zero 与 AI 总结。

### B. "定义框" (Featured Snippet Box) 格式
针对核心术语，在 H2 下方使用以下 HTML 结构：
```html
<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">[概念名称，例如 Qwen 3.7 Max API Router]</h4>
  <p class="mt-2 text-sm text-gray-300">[1-2句高密度技术定义，例如：“Qwen 3.7 Max API Router is an enterprise-grade gateway on APIVALE that wraps Alibaba Cloud's flagship model endpoints into OpenAI-compatible format with zero-credit-card PayPal billing.”]</p>
</div>
```

### C. E-E-A-T 专家 Persona 轮换署名
禁止使用 "Marketing Team" 署名，轮换使用以下工程师 Persona：
1. **Alex Rivera** (Senior Cloud Architect & API Integrations) - 擅长高并发路由、延迟优化、多模型网关。
2. **Kenji Tanaka** (AI Developer Relations Engineer) - 擅长多模态模型调用、前端 SDK 集成、Claude Code CLI 配置。
3. **Sofia Costa** (FinTech Integration & API Security Expert) - 擅长 PayPal 全球支付、API 网关风控、Header 认证调试。

### D. FAQPage 结构化数据 (JSON-LD)
文章末尾必须注入 `FAQPage` Schema，问答需在 1-2 句内给出直接答案（Direct Answer）。

---

## 7. 内外链建设规范 (Internal & External Link Standard)

*   **上下文内链 (Contextual Internal Links)**：每篇文章必须包含 **2-3 个上下文内链**，采用自然技术锚文本链接至已发布的 APIVALE 博文，传递页面权重并形成中心辐射（Center-Spoke）网络。
*   **权威外链背书 (Authoritative External Links)**：正文必须包含 **1-2 个指向官方权威文档** 的外链（如 Anthropic Official Docs, OpenAI API Reference, GitHub Official Repository），为读者提供延伸查证依据，同时向 Google 传递 PageRank 信任信号。

---

## 8. 富媒体与动图规范 (Rich Media & WebP Standards)

*   **配图优先级**：优先使用真实终端/配置界面截图或 WebP 录屏动画；抽象架构图可使用 AI 高画质概念插图兜底。
*   **跨模态向量锚点 (Multimodal Entity Anchors)**：多模态 AI 模型（GPT-4o, Gemini 2.0, Claude 3.5）将文本与图片映射在同一向量空间中。终端运行截图、带有标注的架构图与 JSON 返回报文图，能为多模态 LLM 提供与正文相呼应的视觉语义锚点（Cross-modal Cosine Similarity），显著提升图文被 AI 搜索引用的概率。
*   **格式与大小**：静态图使用 `.webp`，动图强制使用压缩的 `.webp` 格式（**严禁使用老旧 `.gif`**）。单张动图 **≤ 1.5MB**，静态图 **≤ 200KB**。
*   **LCP/CLS 优化**：首屏图片设置 `fetchpriority="high"`（禁止 lazy load）；非首屏图片使用 `loading="lazy"`。所有图片必须包含显式宽高或宽高比，防止页面抖动。
*   **Alt 标签**：文件名采用中划线小写命名（如 `how-to-connect-qwen-3-7-max.webp`），`alt` 标签必须用详细英文阐述图片内容（包含实体名称与终端命令）。

---

## 9. 支付方式与模型Recency强制规范

*   **支付方式 (Payment Method)**：APIVALE 官方支持的支付方式为 **PayPal（PayPal Global Billing / 国际信用卡通过 PayPal）**。
    *   **强制禁忌**：**严禁** 在文章、CTA 或宣传中声明 Stripe 或加密货币 (Crypto) 为 APIVALE 支持的支付方式！统一使用 **PayPal** / **PayPal Global Billing**。
*   **模型Recency**：做 Benchmarks 或竞品对比时，始终引用最新旗舰 LLM 版本（如 Anthropic 的 **Claude Sonnet 5**，阿里 **Qwen 3.7 Max**，DeepSeek **DeepSeek V4**）。
    *   *注*：在 APIVALE 系统中，Qwen 3.7 Max 的实际调用模型名称为 `infer/qwen3.7-max`。
*   **协议兼容性**：强调 APIVALE 对 OpenAI 和 Anthropic API 原生协议的完美兼容（支持 Claude Code CLI, Cursor, Windsurf 等工具直连）。

---

## 10. 写作禁忌与防呆红线 (Prohibited Red Lines)

1. **严禁编造 / 虚构 API 参数**：所有 Endpoint（如 `/v1/chat/completions`）、Headers 及 Payload 必须与 APIVALE 线上网关一致。
2. **严禁空洞营销废词**：禁止使用 "the best", "revolutionary", "groundbreaking" 等虚词，改用实测数据支撑（如 "averages 120ms TTFT", "cuts gateway latency by 35%"）。
3. **严禁缺少 Error Handling 的代码**：代码示例中必须包含 `try-catch` 或 HTTP 状态码校验（特别是 `401 Unauthorized` 和 `429 Rate Limit`）。
4. **严禁产生 Copycat 同质化内容**：每篇文章必须通过“独特性 4 个 1”与 AI Query Fan-Out 多维子问题全覆盖进行差异化超越。
5. **严禁标题层级跳跃**：必须严格遵循 1 个 H1 -> H2 -> H3 的树状层级，禁止直接从 H1 跳至 H3。
