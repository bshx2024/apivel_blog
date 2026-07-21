# APIVALE 技术博客写作与优化标准 (Developer Blog Writing & SEO/GEO Standard)

本文档基于 `EcoReheating` 博客标准，结合开发者受众（Developers, AI Engineers, CTOs）的实际需求进行定制，旨在规范 `apivale.com` 技术博客的内容深度、SEO/GEO（生成式引擎优化）表现以及代码集成标准。

---

## 1. 核心参考价值与定制策略

`EcoReheating` 的标准在 **内容深度（FAQ + 专家引语）**、**GEO 优化（直接答案 + Schema）** 以及 **结构化输出** 上有极高的参考价值。针对 `apivale.com` 的开发者受众，我们进行了如下定制调整：

| 维度 | EcoReheating 工业节能标准 | APIVALE 开发者技术博客标准 (本项目) |
| :--- | :--- | :--- |
| **受众定位** | 传统钢厂、工业决策者（偏重商业 ROI 与政策） | 开发者、独立创作者、AI 工程师、CTO（偏重技术实现与成本） |
| **文章字数** | 2500 - 3500 词 | **1500 - 2500 词**（由于包含大量代码和数学计算，行文需更高效直接） |
| **核心卖点** | 零资本开支 (Zero CAPEX)、节能 7-15% | **免去 +86 手机号、免实名、100% 官方正版、低延迟路由、Stripe 快捷支付** |
| **技术元素** | 燃烧炉原理、热量回收等工业概念 | **可直接运行的代码示例 (cURL/Python/TS)、延迟与成本计算公式** |
| **GEO 重点** | 工业行业规范与背书 | **直击痛点（API 401/403/502 错误码）的直接排查方案** |

---

## 2. 文章结构标准 (Article Structure)

每篇技术文章必须严格遵循以下结构，确保读者在前 20% 的内容内即可获取最关键的解决路径。

```
├── 1. Title & Meta (50-60字符, 关键词靠前)
├── 2. Introduction (痛点陈述 + 核心解决方案 + 可运行的代码简短示例)
├── 3. Comparison Table (第一幅图表后：价格、限频、支持模型的对比)
├── 4. Technical Modules (2-3个核心技术板块，含详细调用代码)
├── 5. Developer FAQ (针对 AI GEO 抓取的 3-4个技术问答)
├── 6. Schema JSON-LD (FAQPage 结构化数据)
└── 7. CTA (开发者导向：免费额度注册、集成指南下载)
```

### A. 痛点引入与快速开始 (Quick Start)
*   **要求**：前 150 字内必须讲透痛点（如“海外调用 Kling 3.0 API 遇到国外卡拒付”、“GLM 注册需要实名”），紧接着提供一个 **3 行以内的最简 cURL 代码示例**。
*   **目的**：让开发者立即确认“这篇文章有干货，能解决我的代码问题”。

### B. 核心参数/价格对比表格 (Comparison Table)
*   **位置**：文章前 20% 处。
*   **要求**：使用 Markdown 表格，对比以下指标（根据文章主题选择）：
    *   API 资费 (每 1M Tokens 价格，或每张图片生成价格)
    *   最大并发限制 (Rate Limit - RPM/TPM)
    *   连接延迟 (Latency - TTFT)
    *   支付门槛 (是否支持 Stripe/国际信用卡/Crypto)

### C. 真实可运行的代码模块
*   每篇文章必须包含至少两个主流语言的完整集成代码（推荐 **Python** 和 **TypeScript**），并带齐必要的依赖安装指令（如 `npm install` 或 `pip install`）。

---

## 3. SEO 与 GEO (生成式引擎优化) 标准

为了确保博客能被 ChatGPT/Perplexity 等 AI 搜索工具和 Google Snippet 精准引用，写作必须严格聚焦于 **GEO 的三大支柱 (Three Pillars of GEO)**：

### A. GEO 三大支柱落地规范

1. **可引用的事实 (Citeable Facts)**
   * **数据密集**：博文必须提供真实可信的硬性数据（如价格对比表格、100% 真实的延迟测算、Token 减少百分比等），减少 AI 抓取时的“幻觉”。
   * **客观事实**：禁止空洞的营销词汇（见第 6 节防呆红线）。使用客观参数与 telemetry 数据为 AI 引擎提供理想的引用源。
   * **可运行代码**：提供最简、真实的 cURL/Python/TS 代码片段（包含异常处理），作为开发者的技术事实依据。

2. **实体权威性 (Entity Authority)**
   * **品牌与产品实体**：在文中以标准格式提及品牌实体（如 `APIVALE` 或 `APIVALE Unified API Hub`），并配合合理的内链，增强 AI 知识图谱对品牌实体的公信力关联。
   * **技术与模型实体**：准确提及行业内标准实体（如 `GPT-5.6`, `Claude 3.5 Sonnet`, `DeepSeek-V4` 等），并将它们与 APIVALE 提供的连接与路由解决方案进行实体关联。
   * **专家身份 (E-E-A-T)**：通过真实的作者署名（见第 4 节）以及 FAQ 结构化数据 Schema 确立专业实体背书。

3. **语义深度 (Semantic Depth)**
   * **全覆盖与无废话**：篇幅控制在 1500 - 2500 字，围绕主题做深度探讨（如不仅讲“如何调用”，还要深入探讨“成本优化”、“异常排查”、“网关路由逻辑”）。
   * **语义相关性 (LSI)**：拒绝关键词堆砌，转而覆盖与核心主题高度相关的技术上下文（如提及 `GPT-5.6` 时，自然引入 `Prompt Caching`、`Token Consumption`、`Unified API Gateway`）。
   * **定义框 (Featured Snippet)**：对核心技术词汇进行高密度的定义，方便搜索引擎提取。

### B. "定义框" (Featured Snippet Box)
针对特定术语（如 LLM Router, API Bridge 等），在文章的 H2 下方插入以下格式的定义：
```html
<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">[概念名称，例如 Kling API Bridge]</h4>
  <p class="mt-2 text-sm text-gray-300">[1-2句的高密度技术定义，例如：“Kling API Bridge is a routing layer that wraps the official Kling 3.0 endpoints, allowing global developers to bypass geographical and billing restrictions through a standardized OpenAI-compatible format.”]</p>
</div>
```

### C. 直接问答 (Developer FAQ)
*   每篇博文结尾前必须包含 **3-4 个 FAQ**。
*   **要求**：问题加粗，回答的前 1-2 句必须是高度精炼的“直接答案”，以便被 AI 搜索引擎提取。

---

## 4. E-E-A-T (专业度与可信度) 与作者署名

开发者只信任有实战经验的工程师所写的技术文章，禁止以 "Marketing Team" 署名。

### A. 虚拟专家 Persona 列表 (轮换使用)
1.  **Alex Rivera** (Senior Cloud Architect & API Integrations)
    *   *擅长*：高并发路由、延迟优化、多模型网关架构。
2.  **Kenji Tanaka** (AI Developer Relations Engineer)
    *   *擅长*：多模态模型调用 (Kling/Sora)、前端 SDK 快速集成、Demo 制作。
3.  **Sofia Costa** (FinTech Integration & API Security Expert)
    *   *擅长*：跨境支付风控、多租户 API 安全设计、Stripe 接口调试。

### B. 结构化数据 (Schema)
文章末尾必须注入 `FAQPage` 结构化数据，确保 Question 字段与正文中的 FAQ 完全一致。

---

## 5. 富媒体与动图规范 (Rich Media & WebP Animations)

为了将抽象的终端配置可视化，博文必须在核心实操模块引入**高清截图**或 **WebP 录屏动画**，以建立视觉实证并极大提升停留时间（Dwell Time）和转化率（CRO）。

### A. 配图获取优先级与插入位置
*   **第一优先级：真实界面截图/录屏**：对于具体的代码配置、插件填写、终端执行指令等，必须优先使用真实的界面截图或录屏动图（可通过 CodexLink 截屏工具自动截取），向开发者展示 100% 真实的配置过程。
*   **第二优先级（兜底）：AI 生成的插图/概念动画**：对于一些偏抽象的逻辑（如“智能网关路由原理”、“全球延迟对比”等无直观配置界面的模块），在实在找不到合适真实配图时，允许使用 AI 生成的高画质概念插图、架构渲染图或示意动画作为视觉兜底，以维护页面的美观度和信息丰满度。
*   **最低配置要求**：每篇实操博文至少包含 **1 张高清晰度配置截图**，以及 **1 个核心操作的 WebP 动图录屏**。
*   **插入时机**：通常放置在 H2 下方的快速入门或 Technical Modules 模块中，贴近代码块，作为代码运行结果的视觉佐证。

### B. 动图与图片性能标准
*   **格式要求**：禁止使用老旧的 `.gif` 格式。所有的动图必须压缩并转换为高画质的 **`.webp`** 格式；静态图优先使用 **`.webp`** 格式，矢量原理图使用 **`.svg`** 格式。
*   **文件大小**：单张 WebP 动图的大小**严禁超过 1.5MB**（静态图严禁超过 200KB），以防止拖慢页面首次内容渲染时间（FCP/LCP）。
*   **排版自适应与首屏优化**：位于首屏（Above-the-fold）的图片/动图严禁使用 `loading="lazy"`，而应配置 `fetchpriority="high"`，以保证最佳的移动端首次内容渲染时间（LCP）；非首屏图片使用 `loading="lazy"`。所有图片和动图必须明确指定 `width`/`height` 或 `aspect-ratio`，以防止发生页面布局偏移（CLS）。

### C. 图像 SEO 与 Alt 标签规则
*   **文件命名**：文件名称必须采用小写字母、中划线命名法，且必须包含文章的核心 SEO 关键词。
    *   *反例*：`screen1.png`, `mcp-recording.webp`
    *   *正例*：`how-to-configure-cline-with-apivale-longcat.webp`
*   **Alt 属性强制性**：图片和动图必须包含详细叙述内容的 `alt` 标签。这不仅有利于无障碍阅读，还是 GEO 抓取和 Google Image 搜索的关键。
    *   *Alt 示例*：`![Animated WebP showing a developer configuring the Cline extension inside VS Code with the APIVALE custom endpoint and executing code edits using LongCat-2.0](/images/blog/how-to-configure-cline-with-apivale-longcat.webp)`

---

## 6. 移动优先索引与响应式体验标准 (Mobile-First SEO & UX)

为应对谷歌的 100% 移动优先索引，必须确保博文在小屏设备上具备完美的呈现效果和完整的链接结构，严禁在移动端过滤或精简核心的爬网路径。

### A. 多语言代码的移动端收纳 (Tabs / Accordion)
*   **隐藏内容免除惩罚**：在移动优先索引下，谷歌不会扣除折叠内容（如 Tabs, Accordion, Collapsible）的权重。
*   **实施规范**：在包含多语言代码调用（如 Python/TS/cURL）时，移动端模板必须采用 `Tabs` 或 `Accordion` 的折叠交互收纳多语言版本，避免单页面纵向高度过长影响用户体验，同时确保所有代码分支对爬虫可见。

### B. 核心链接与导航等价性 (Parity)
*   **禁止精简内链**：严禁在移动端视图中隐藏面包屑导航（Breadcrumbs）或移除正文中的上下文内链（Contextual Links）和 CTA。移动端与桌面端的 HTML 必须输出完全一致的 URL 节点。
*   **Tap Targets 触控安全区**：移动端所有可点击元素（如复制按钮、Tab 切换标签、折叠面板头部）的有效点击区域必须达到至少 **48px × 48px**，相邻点击元素之间至少保持 **8px** 间距，以防误触。

### C. 排版自适应与移动可用性 (Usability)
*   **代码与表格防溢出**：所有的 Markdown 表格和长代码块在移动端必须支持横向滚动（容器应用 `overflow-x-auto` 且包含排版防折行），确保阅读时不会把整个页面视口（Viewport）撑大造成横向滚动条。
*   **禁止侵入式插屏**：移动端严禁使用遮挡主视觉的营销弹窗或插屏（Intrusive Interstitials）。如需引导注册，需使用内嵌 CTA 模块或在底部放置非侵入式吸底条。

---

## 7. 写作禁忌与防呆红线 (Prohibited)

*   **禁止编造/使用过时 API 字段**：所有的 API 路径（如 `/v1/chat/completions`）、Header 头部以及 Payload 参数必须与 `apivale.com` 实际提供的一致，杜绝 AI 幻觉产生的虚假代码。
*   **禁止空洞的营销词汇**：避免使用 "the best", "revolutionary", "groundbreaking" 等虚词。改用数据支撑，如 "averages 120ms TTFT", "reduces proxy latency by 35%"。
*   **禁止缺少异常处理 (Error Handling) 的代码**：代码示例中必须包含基本的 `try-catch` 或状态码判断（特别是针对 `401 Unauthorized` 和 `429 Too Many Requests`），这是衡量一篇文章是否是“技术垃圾”的试金石。
*   **禁止不加 Alt 的原理图**：如果配有架构图或对比图，图片 Alt 必须使用长尾英文描述（如 `![Architecture diagram of APIVALE proxy routing DeepSeek API with global CDN endpoints](/images/deepseek-routing.png)`）。
