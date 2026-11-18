# N-gram 密度分析与虚词/介词截断错位规避指南 (N-gram & Preposition Guidelines)

本文档详细记录在 Google SERP 与 SEO 军师评测体系下，多词关键词组合（3~5 词组）的**词频计算机制与避坑铁律**。

---

## 一、 为什么 5 词短语会被强制切分成 4 词？

现代搜索引擎分词器与自动化 SEO 评分工具（如哥飞军师、Page Coach），为了兼顾计算性能与代表性，通常采用**2~4 词滑动窗口 (Sliding Window)** 来推断页面正在做的主题词。
算法规则为：
1. 提取全页所有词汇，清洗掉 HTML 标签、脚本与标点符号；
2. 构建 1-gram、2-gram、3-gram、4-gram 频次分布表；
3. **在 2~4 词中挑选频次最高、且在 Title 和 H1 中出现加权的词组**，作为推断词；
4. 超过 4 个词的长尾短语（5 词及以上），算法会自动从首个词或核心动词开始截断前 4 个词。

---

## 二、 介词 "on" 导致的“赛道错位”真实事故复盘

### 1. 事故原型
* 站长预期的完整主词：`AI coding impact on senior engineers`（6 词）或 `ai coding impact senior engineers`（5 词）。
* 站长在 H1 和正文中的写法：
  `AI coding impact ON senior engineers`

### 2. 算法滑动切片过程
算法在扫描 4 词组合时：
* 词 1: `coding`
* 词 2: `impact`
* 词 3: **`on`（介词占去 1 个槽位）**
* 词 4: `senior`
* 词 5: `engineers`（**超出 4 词窗口，被彻底遗弃！**）

提取出的 4-gram 结果：**`coding impact on senior`**。

### 3. Google SERP 语义雪崩
在英语中：
* `senior` 作为形容词修饰 `engineers / developers` 时，表示资深软件工程师；
* `senior` 单独作为名词或短语结尾时，**90% 的概率表示“老年人 / 退休老人 (Senior Citizens)”**。

当算法拿着被截断的 `coding impact on senior` 去 Google US 检索时，Google 以为用户在问**“60岁以上老年人学编程有什么影响”**，前十名结果全是：
* *Can elderly people learn coding and programming?*
* *Is coding training worth it at 62 years old?*
* *Older Adults Learning Computer Programming*
* *Am I Too Old to Learn Coding?*

结果：**页面侧判定“赛道错位”，Title/URL 覆盖率全部从 100% 暴跌至 75%，直接被扣除 2.5 分！**

---

## 三、 黄金避坑准则 (Golden Rules)

1. **核心短语坚决消除无意义介词**：
   * ❌ 严禁写作：`ai coding impact on senior engineers`
   * ✅ 必须写作：`ai coding impact senior engineers` 或 `coding impact senior engineers`
2. **标点与连接符策略**：
   * 如果在语法上需要断句，优先使用冒号 `:`、破折号 `—` 或换行，切断算法将介词吸纳为同一个 N-gram 的路径：
     * 例：`AI Coding Impact: Senior Engineers, Salary & Jobs`
3. **Title、H1、URL 三位一体 100% 对齐**：
   * `<title>`：`AI Coding Impact Senior Engineers: Salary & Jobs | APIVALE`
   * `<h1>`：`AI Coding Impact Senior Engineers: Salary, Jobs & the $500K Architect`
   * `URL`：`/blog/ai-coding-impact-senior-engineers/`
   * 保证三者中的 4 词组合完全一致，使 Title/H1 判定双双获得 100% 满分。
4. **控制非目标词（如模型代号）的机械重复**：
   * 正文中不要在一句话内连续机械重复竞品或模型名称（如 `Qwen 3.7 Max`, `ERNIE 5.5 Flash`, `DeepSeek V4`），这会导致模型名称霸占 3 词和 4 词密度榜首；
   * 模型名称保留在对比表格和配置代码块中，正文中多用通用指代（如“Tier 1 快速分流模型”、“Tier 2 深度推理网关”），确保目标长词稳居密度榜前两位。
