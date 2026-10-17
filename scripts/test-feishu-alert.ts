#!/usr/bin/env bun
import { sendFeishuBlogAlert } from "./notifier.js";

async function testAlert() {
  console.log("🚀 Testing live Feishu alert push...");
  
  const result = await sendFeishuBlogAlert({
    keyword: "OpenAI Dots API",
    category: "Western Flagship Persistent Agent",
    level: "S (极速抢发)",
    suggestedSlug: "openai-dots-api-pricing-vs-muse",
    metaTitle: "OpenAI Dots API: Pricing, Token Burn & Fail Fixes | APIVALE",
    suggestedH1: "OpenAI Dots API, Pricing & Failures: Production Review & Workarounds",
    searchIntentNote: "开发者搜索官方有无独立 API、Pro $100/月价格门槛与后台 30 万 Token 消耗排坑",
    trendsUrl: "https://trends.google.com/trends/explore?q=openai%20dots",
    serpUrl: "https://www.google.com/search?q=openai+dots+api+pricing"
  }, "🚨 APIVALE 博客流量雷达：通道联通测试");

  console.log("Result:", result);
}

testAlert();
