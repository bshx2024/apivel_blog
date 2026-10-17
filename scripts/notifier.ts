import fs from "node:fs";
import path from "node:path";

export interface BlogAlertItem {
  keyword: string;
  category: string;
  level: "S (极速抢发)" | "A (高潜引流)" | "B (关注)";
  suggestedSlug: string;
  metaTitle: string;
  suggestedH1: string;
  searchIntentNote?: string;
  detectedAt?: string;
  trendsUrl?: string;
  serpUrl?: string;
}

export function getWebhookUrl(): string {
  if (process.env.ALERT_WEBHOOK_URL) return process.env.ALERT_WEBHOOK_URL;
  
  // Try reading .env or .env.mcp
  const rootDir = process.cwd();
  const envFiles = [path.join(rootDir, ".env"), path.join(rootDir, ".env.mcp")];
  
  for (const envFile of envFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, "utf-8");
        const match = content.match(/ALERT_WEBHOOK_URL=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) return match[1].trim();
      }
    } catch {}
  }

  return "https://open.feishu.cn/open-apis/bot/v2/hook/1819843f-9104-4177-915f-714f027006b6";
}

/**
 * Dispatch rich interactive cards to Feishu/Lark Webhook
 */
export async function sendFeishuBlogAlert(
  items: BlogAlertItem | BlogAlertItem[],
  customHeaderTitle = "🚨 APIVALE 博客流量雷达：检出 S 级极速引流新词"
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: "No ALERT_WEBHOOK_URL configured." };
  }

  const alerts = Array.isArray(items) ? items : [items];
  if (alerts.length === 0) return { success: true, message: "Empty alerts list" };

  const isFeishu = webhookUrl.includes("feishu.cn") || webhookUrl.includes("larksuite.com");

  if (!isFeishu) {
    // Standard text webhook fallback
    const title = `🚨 [APIVALE SEO Radar] 检出 ${alerts.length} 个新词机会`;
    const lines = alerts.map((a, i) =>
      `${i + 1}. [${a.level}] **${a.keyword}**\n   - Title: ${a.metaTitle}\n   - H1: ${a.suggestedH1}\n   - Slug: /blog/${a.suggestedSlug}/`
    ).join("\n\n");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg_type: "text", content: { text: `${title}\n\n${lines}` } })
      });
      return { success: res.ok, message: `Generic webhook returned ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  // Feishu Interactive Card
  const cardElements: any[] = [
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: `**🎯 博客雷达已检出 ${alerts.length} 个符合 APIVALE 引流发布标准的极速商业新词！**\n涵盖前沿模型生态与 IDE 痛点，建议在 24 小时黄金窗口内立项抢占 Google 首页。`
      }
    },
    { tag: "hr" }
  ];

  alerts.forEach((a, i) => {
    const trendsUrl = a.trendsUrl || `https://trends.google.com/trends/explore?q=${encodeURIComponent(a.keyword)}`;
    const serpUrl = a.serpUrl || `https://www.google.com/search?q=${encodeURIComponent(a.keyword)}`;

    cardElements.push({
      tag: "div",
      fields: [
        {
          is_short: true,
          text: {
            tag: "lark_md",
            content: `**📌 候选词 #${i + 1}:**\n**${a.keyword}**`
          }
        },
        {
          is_short: true,
          text: {
            tag: "lark_md",
            content: `**⭐ 评级:**\n\`${a.level}\``
          }
        },
        {
          is_short: true,
          text: {
            tag: "lark_md",
            content: `**🗂️ 赛道分类:**\n${a.category}`
          }
        },
        {
          is_short: true,
          text: {
            tag: "lark_md",
            content: `**🔗 建议 Slug:**\n\`/blog/${a.suggestedSlug}/\``
          }
        }
      ]
    });

    if (a.metaTitle) {
      cardElements.push({
        tag: "div",
        text: {
          tag: "lark_md",
          content: `**💡 建议 Meta Title:** \`${a.metaTitle}\` (${a.metaTitle.length} chars)`
        }
      });
    }

    if (a.suggestedH1) {
      cardElements.push({
        tag: "div",
        text: {
          tag: "lark_md",
          content: `**📝 建议落地 H1:** \`${a.suggestedH1}\``
        }
      });
    }

    cardElements.push({
      tag: "action",
      actions: [
        {
          tag: "button",
          text: { tag: "plain_text", content: "📈 Google Trends" },
          type: "primary",
          url: trendsUrl
        },
        {
          tag: "button",
          text: { tag: "plain_text", content: "🔍 Google SERP 竞品" },
          type: "default",
          url: serpUrl
        },
        {
          tag: "button",
          text: { tag: "plain_text", content: "🌐 打开 APIVALE 博客" },
          type: "default",
          url: "https://apivel.com/blog/"
        }
      ]
    });

    cardElements.push({ tag: "hr" });
  });

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "interactive",
        card: {
          config: { wide_screen_mode: true },
          header: {
            title: { tag: "plain_text", content: customHeaderTitle },
            template: "red"
          },
          elements: cardElements
        }
      })
    });

    if (res.ok) {
      return { success: true, message: `Successfully pushed ${alerts.length} cards to Feishu.` };
    } else {
      const errText = await res.text();
      return { success: false, message: `Feishu response error: ${errText}` };
    }
  } catch (err: any) {
    return { success: false, message: `Webhook push failed: ${err.message}` };
  }
}
