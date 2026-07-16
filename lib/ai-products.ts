/**
 * @file ai-products.ts
 * @description 市面上主流 AI 产品展示数据（仅作展示，链接均为官方站点）
 * @author gouxinjie
 * @created 2026-07-16
 */

/** 双语文案 */
export interface I18nText {
  /** 简体中文 */
  zh: string;
  /** 英文 */
  en: string;
}

/** 单个 AI 产品展示条目 */
export interface AiProduct {
  /** 产品名称（专有名词，语言无关） */
  name: string;
  /** 官方网站地址 */
  url: string;
  /** 分类标签（双语） */
  category: I18nText;
  /** 一句话简介（双语） */
  desc: I18nText;
  /** 头像底色（品牌色） */
  accent: string;
}

/**
 * 市面主流 AI 产品清单
 * @description 覆盖对话、搜索、图像、编程、视频、音乐等场景，用于「AI 搜索」Tab 展示
 */
export const aiProducts: AiProduct[] = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "OpenAI 推出的通用对话助手，支持写作、分析与代码。",
      en: "OpenAI's general-purpose assistant for writing, analysis and coding.",
    },
    accent: "#10A37F",
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "Anthropic 出品的对话模型，以长文本理解与严谨推理见长。",
      en: "Anthropic's model strong at long-context understanding and careful reasoning.",
    },
    accent: "#D97757",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "谷歌的多模态大模型，深度整合搜索与生态。",
      en: "Google's multimodal model deeply integrated with Search and its ecosystem.",
    },
    accent: "#4285F4",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: { zh: "搜索", en: "Search" },
    desc: {
      zh: "对话式 AI 搜索引擎，给出带引用来源的答案。",
      en: "A conversational AI search engine that answers with cited sources.",
    },
    accent: "#20808D",
  },
  {
    name: "DeepSeek",
    url: "https://www.deepseek.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "国产开源大模型，以高性价比与推理能力著称。",
      en: "An open-weight model known for strong reasoning at low cost.",
    },
    accent: "#4D6BFE",
  },
  {
    name: "Kimi",
    url: "https://kimi.moonshot.cn",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "月之暗面推出的长上下文助手，擅长长文档处理。",
      en: "Moonshot's long-context assistant that excels at long documents.",
    },
    accent: "#1F1F1F",
  },
  {
    name: "豆包",
    url: "https://www.doubao.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "字节跳动旗下的 AI 助手，覆盖对话、创作与办公。",
      en: "ByteDance's assistant covering chat, creation and office tasks.",
    },
    accent: "#FD4B55",
  },
  {
    name: "文心一言",
    url: "https://yiyan.baidu.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "百度推出的中文大模型，深度融合搜索与中文场景。",
      en: "Baidu's Chinese model deeply integrated with search.",
    },
    accent: "#2932E1",
  },
  {
    name: "通义千问",
    url: "https://tongyi.aliyun.com",
    category: { zh: "对话", en: "Chat" },
    desc: {
      zh: "阿里云的大模型，覆盖对话、编码与多模态。",
      en: "Alibaba Cloud's model spanning chat, coding and multimodal.",
    },
    accent: "#615CED",
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: { zh: "图像", en: "Image" },
    desc: {
      zh: "领先的 AI 图像生成工具，以艺术化画风著称。",
      en: "A leading AI image generator known for its artistic style.",
    },
    accent: "#1F1F1F",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    category: { zh: "编程", en: "Coding" },
    desc: {
      zh: "基于 AI 的代码编辑器，深度理解整个代码库。",
      en: "An AI-first code editor that understands your whole codebase.",
    },
    accent: "#000000",
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    category: { zh: "视频", en: "Video" },
    desc: {
      zh: "面向创作者的 AI 视频生成与编辑工具。",
      en: "AI video generation and editing tools built for creators.",
    },
    accent: "#00D8C4",
  },
  {
    name: "Suno",
    url: "https://suno.com",
    category: { zh: "音乐", en: "Music" },
    desc: {
      zh: "AI 音乐生成平台，输入歌词即可生成完整歌曲。",
      en: "An AI music platform that turns prompts into full songs.",
    },
    accent: "#FF7A00",
  },
  {
    name: "Copilot",
    url: "https://copilot.microsoft.com",
    category: { zh: "助手", en: "Assistant" },
    desc: {
      zh: "微软推出的 AI 助手，深度集成 Office 与 Windows。",
      en: "Microsoft's assistant deeply integrated with Office and Windows.",
    },
    accent: "#7B5BF5",
  },
];
