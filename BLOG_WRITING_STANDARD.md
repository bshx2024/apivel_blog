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

为了确保博客能被 ChatGPT/Perplexity 等 AI 搜索工具和 Google Snippet 精准引用：

### A. "定义框" (Featured Snippet Box)
针对特定术语（如 LLM Router, API Bridge 等），在文章的 H2 下方插入以下格式的定义：
```html
<div class="my-6 border-l-4 border-indigo-500 bg-gray-900 rounded-r-lg p-5">
  <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Definition</span>
  <h4 class="mt-1 text-md font-semibold text-white">[概念名称，例如 Kling API Bridge]</h4>
  <p class="mt-2 text-sm text-gray-300">[1-2句的高密度技术定义，例如：“Kling API Bridge is a routing layer that wraps the official Kling 3.0 endpoints, allowing global developers to bypass geographical and billing restrictions through a standardized OpenAI-compatible format.”]</p>
</div>
```

### B. 直接问答 (Developer FAQ)
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

## 5. 写作禁忌与防呆红线 (Prohibited)

*   **禁止编造/使用过时 API 字段**：所有的 API 路径（如 `/v1/chat/completions`）、Header 头部以及 Payload 参数必须与 `apivale.com` 实际提供的一致，杜绝 AI 幻觉产生的虚假代码。
*   **禁止空洞的营销词汇**：避免使用 "the best", "revolutionary", "groundbreaking" 等虚词。改用数据支撑，如 "averages 120ms TTFT", "reduces proxy latency by 35%"。
*   **禁止缺少异常处理 (Error Handling) 的代码**：代码示例中必须包含基本的 `try-catch` 或状态码判断（特别是针对 `401 Unauthorized` 和 `429 Too Many Requests`），这是衡量一篇文章是否是“技术垃圾”的试金石。
*   **禁止不加 Alt 的原理图**：如果配有架构图或对比图，图片 Alt 必须使用长尾英文描述（如 `![Architecture diagram of APIVALE proxy routing DeepSeek API with global CDN endpoints](/images/deepseek-routing.png)`）。
