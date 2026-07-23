/**
 * @file ai-products.ts
 * @description 市面上主流 AI 产品展示数据（仅作展示，链接均为官方站点）
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-23 数据通过 props 流向客户端组件（类型安全，不进入客户端 bundle）
 */

/** 双语文案 */
export interface I18nText {
  /** 简体中文 */
  zh: string;
  /** 英文 */
  en: string;
}

/** 产品所属区域 */
export type AiRegion = "domestic" | "overseas";

/** 区域双语标签（国内 / 国外） */
export const aiRegionLabels: Record<AiRegion, I18nText> = {
  domestic: { zh: "国内", en: "Domestic" },
  overseas: { zh: "国外", en: "Overseas" },
};

/** 产品分类（用于 Tab 切换栏） */
export type AiCategory =
  | "chat"
  | "search"
  | "dev"
  | "agent"
  | "image"
  | "video"
  | "audio"
  | "platform";

/** 分类双语标签（含「全部」） */
export const aiCategoryLabels: Record<AiCategory | "all", I18nText> = {
  all: { zh: "全部", en: "All" },
  chat: { zh: "AI 对话", en: "AI Chat" },
  search: { zh: "AI 搜索", en: "AI Search" },
  dev: { zh: "AI 开发工具", en: "AI Dev Tools" },
  agent: { zh: "AI 智能体工作台", en: "AI Agent Workbench" },
  image: { zh: "文生图", en: "Image" },
  video: { zh: "文生视频", en: "Video" },
  audio: { zh: "音乐 & 音频", en: "Music & Audio" },
  platform: { zh: "模型 & 平台", en: "Models & Platform" },
};

/** Tab 展示顺序（首项为「全部」） */
export const categoryOrder: (AiCategory | "all")[] = [
  "all",
  "chat",
  "dev",
  "agent",
  "image",
  "video",
  "audio",
  "platform",
  "search",
];

/** 单个 AI 产品展示条目 */
export interface AiProduct {
  /** 产品名称（专有名词，语言无关） */
  name: string;
  /** 官方网站地址 */
  url: string;
  /** 分类（对应 Tab） */
  category: AiCategory;
  /** 一句话简介（双语） */
  desc: I18nText;
  /** 所属区域：国内 / 国外 */
  region: AiRegion;
  /** 品牌色（头像底色、标签边框、公司名色） */
  accent: string;
  /** 所属公司 / 团队名称（双语） */
  company: I18nText;
  /** 卡片右上角标记（双语，可选）：如「🔥 热门」「⭐ 推荐」；不填则使用 company 名 */
  badge?: I18nText;
  /** 产品功能标签（双语，最多 4 个）：在简介下方以彩色小标签展示 */
  tags?: I18nText[];
  /** 品牌图标地址（可选）：不填则自动使用 Google favicon 服务获取 */
  logo?: string;
}

/**
 * 市面主流 AI 产品清单
 * @description 按「分类 + 国内/国外」组织，用于 AI 产品页 Tab 展示
 */
export const aiProducts: AiProduct[] = [
  // ──────────────── 国外（Overseas） ────────────────
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: "chat",
    desc: {
      zh: "OpenAI 的旗舰对话助手，GPT-4 系列驱动，支持联网搜索、文件上传、图像理解与生成，覆盖写作、分析、编程等全场景任务。",
      en: "OpenAI's flagship assistant powered by GPT-4, with web browsing, file uploads, vision, and image generation for writing, analysis and coding.",
    },
    region: "overseas",
    accent: "#10A37F",
    company: { zh: "OpenAI", en: "OpenAI" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "智能对话", en: "AI Chat" },
      { zh: "写作辅助", en: "Writing" },
      { zh: "代码生成", en: "Code Gen" },
    ],
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "chat",
    desc: {
      zh: "Anthropic 打造的对话模型，支持超长上下文窗口与严谨逻辑推理，注重安全可控输出，适合复杂文档分析、深度研究与专业写作场景。",
      en: "Anthropic's model with ultra-long context windows and precise reasoning, prioritizing safe and controlled outputs for complex documents, deep research and professional writing.",
    },
    region: "overseas",
    accent: "#D97757",
    company: { zh: "Anthropic", en: "Anthropic" },
    badge: { zh: "⭐ 推荐", en: "⭐ Recommend" },
    tags: [
      { zh: "长文本理解", en: "Long Context" },
      { zh: "严谨推理", en: "Reasoning" },
      { zh: "安全可靠", en: "Safe & Reliable" },
    ],
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "chat",
    desc: {
      zh: "Google 的多模态大模型，原生支持文本、图像、音频与视频输入，深度整合 Google 搜索、Gmail、YouTube 等生态服务，一站式智能体验。",
      en: "Google's multimodal model natively handles text, images, audio and video, deeply integrated with Search, Gmail, YouTube and the wider Google ecosystem.",
    },
    region: "overseas",
    accent: "#4285F4",
    company: { zh: "Google", en: "Google" },
    tags: [
      { zh: "多模态", en: "Multimodal" },
      { zh: "实时搜索", en: "Search" },
      { zh: "Google 生态", en: "Ecosystem" },
    ],
  },
  {
    name: "Grok",
    url: "https://grok.com",
    category: "chat",
    desc: {
      zh: "马斯克 xAI 推出的对话模型，默认接入 X 平台实时信息流，风格幽默直白、回答大胆，适合追踪热点话题与轻松随性的日常聊天。",
      en: "xAI's conversational model with native X (Twitter) real-time access, known for its witty, unfiltered style — great for hot takes and casual chats.",
    },
    region: "overseas",
    accent: "#111111",
    company: { zh: "xAI", en: "xAI" },
    badge: { zh: "X 官方", en: "X Official" },
    tags: [
      { zh: "实时联网", en: "Real-time Web" },
      { zh: "幽默风格", en: "Witty" },
      { zh: "X 集成", en: "X Integration" },
    ],
  },
  {
    name: "Poe",
    url: "https://poe.com",
    category: "chat",
    desc: {
      zh: "Quora 推出的模型聚合平台，用户在单一界面中一键切换 ChatGPT、Claude、Gemini 等主流模型，按场景选择最优回答，无需多账号切换。",
      en: "Quora's model hub where you can switch between ChatGPT, Claude, Gemini and more in one interface — pick the best model for every task.",
    },
    region: "overseas",
    accent: "#B92B27",
    company: { zh: "Quora", en: "Quora" },
    badge: { zh: "聚合平台", en: "Aggregator" },
    tags: [
      { zh: "多模型", en: "Multi-Model" },
      { zh: "一键切换", en: "One-click Switch" },
    ],
  },
  {
    name: "Character.AI",
    url: "https://character.ai",
    category: "chat",
    desc: {
      zh: "可自由创建并对话虚拟角色的 AI 陪伴平台，支持个性化人设定制与社区分享，覆盖动漫、影视、名人等多类角色扮演场景。",
      en: "A platform to create and chat with virtual AI characters, with custom personas, community sharing, and roleplay across anime, movies, celebrities and more.",
    },
    region: "overseas",
    accent: "#5C5CE6",
    company: { zh: "Character.AI", en: "Character.AI" },
    badge: { zh: "角色对话", en: "Roleplay" },
    tags: [
      { zh: "角色扮演", en: "Roleplay" },
      { zh: "个性化对话", en: "Personalized" },
      { zh: "创意社区", en: "Creative" },
    ],
  },
  {
    name: "Meta AI",
    url: "https://www.meta.ai",
    category: "chat",
    desc: {
      zh: "Meta 的通用 AI 助手，深度集成 Facebook、Instagram、WhatsApp 等社交产品，已接入 Ray-Ban 智能眼镜，实现拍照问答与实时翻译等场景。",
      en: "Meta's AI assistant woven into Facebook, Instagram and WhatsApp, plus Ray-Ban smart glasses for photo Q&A, real-time translation and hands-free interaction.",
    },
    region: "overseas",
    accent: "#0866FF",
    company: { zh: "Meta", en: "Meta" },
    tags: [
      { zh: "社交集成", en: "Social" },
      { zh: "智能眼镜", en: "Smart Glasses" },
      { zh: "多模态", en: "Multimodal" },
    ],
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "search",
    desc: {
      zh: "对话式 AI 搜索引擎，每次回答均附带真实来源引用链接，支持聚焦搜索特定网站或领域，适合学术研究、事实核查与商业调研等深度场景。",
      en: "A conversational AI search engine that answers with real cited sources, allowing focused searches within specific sites — ideal for research, fact-checking and deep dives.",
    },
    region: "overseas",
    accent: "#20808D",
    company: { zh: "Perplexity", en: "Perplexity" },
    tags: [
      { zh: "对话搜索", en: "Conversational" },
      { zh: "来源引用", en: "Citations" },
      { zh: "实时信息", en: "Real-time" },
    ],
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    category: "dev",
    desc: {
      zh: "基于 VS Code 的 AI 代码编辑器，可深度理解整个代码库结构与上下文，支持多文件联编、内联对话与一键应用修改，极大提升开发效率。",
      en: "A VS Code-based AI editor that deeply understands your codebase, supporting multi-file edits, inline chat, and one-click changes for maximum developer productivity.",
    },
    region: "overseas",
    accent: "#000000",
    company: { zh: "Cursor", en: "Cursor" },
    tags: [
      { zh: "AI 编辑器", en: "AI Editor" },
      { zh: "代码库理解", en: "Codebase" },
      { zh: "智能补全", en: "Completion" },
    ],
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "dev",
    desc: {
      zh: "GitHub 与 OpenAI 联合打造的编程助手，深度集成 VS Code 与 JetBrains 等主流 IDE，提供行级/块级代码实时补全、聊天问答与 PR 描述自动生成。",
      en: "GitHub and OpenAI's coding assistant deeply integrated into VS Code, JetBrains and more, with live code completions, chat Q&A, and automated PR descriptions.",
    },
    region: "overseas",
    accent: "#6E5494",
    company: { zh: "GitHub + OpenAI", en: "GitHub + OpenAI" },
    tags: [
      { zh: "IDE 集成", en: "IDE Plugin" },
      { zh: "代码补全", en: "Completion" },
      { zh: "代码生成", en: "Code Gen" },
    ],
  },
  {
    name: "Trae",
    url: "https://trae.ai",
    category: "dev",
    desc: {
      zh: "字节跳动推出的 AI IDE，内置对话面板与智能代码补全，强调「人主导、AI 辅助」的协作模式，支持从设计稿到代码的快速转换与多文件重构。",
      en: "ByteDance's AI IDE with built-in chat and smart code completion, emphasizing human-led coding with AI support — from design-to-code conversion to multi-file refactoring.",
    },
    region: "overseas",
    accent: "#0EA5E9",
    company: { zh: "字节跳动", en: "ByteDance" },
    tags: [
      { zh: "AI IDE", en: "AI IDE" },
      { zh: "智能补全", en: "Completion" },
      { zh: "人机协作", en: "Human-led" },
    ],
  },
  {
    name: "CodeBuddy",
    url: "https://www.codebuddy.cn",
    logo: "/logos/www.codebuddy.cn.svg",
    category: "dev",
    desc: {
      zh: "腾讯云推出的 AI 代码助手，深度理解项目上下文与工程结构，提供实时补全、智能答疑与代码重构建议，支持多种主流开发语言与框架。",
      en: "Tencent Cloud's AI coding assistant that deeply understands project context and structure, offering live completions, smart Q&A and refactoring suggestions across popular languages and frameworks.",
    },
    region: "domestic",
    accent: "#2F80ED",
    company: { zh: "腾讯云", en: "Tencent Cloud" },
    tags: [
      { zh: "代码助手", en: "Coding" },
      { zh: "项目理解", en: "Project" },
      { zh: "智能答疑", en: "Q&A" },
    ],
  },
  {
    name: "Amazon CodeWhisperer",
    url: "https://aws.amazon.com/q/developer/",
    category: "dev",
    desc: {
      zh: "AWS 推出的 AI 编程助手，深度集成云开发环境，支持代码实时补全、安全漏洞自动扫描与基础设施即代码生成，对 AWS 服务有最优优化建议。",
      en: "AWS's AI coding assistant with deep cloud-dev integration, offering real-time code completion, automatic security vulnerability scanning, and optimized suggestions for AWS services.",
    },
    region: "overseas",
    accent: "#FF9900",
    company: { zh: "AWS", en: "AWS" },
    tags: [
      { zh: "云集成", en: "Cloud" },
      { zh: "代码补全", en: "Completion" },
      { zh: "安全检查", en: "Security" },
    ],
  },
  {
    name: "Codex",
    url: "https://openai.com/codex",
    category: "agent",
    desc: {
      zh: "OpenAI 的自主编码 Agent，可在云端独立规划任务、编写完整代码、运行测试并直接提交 Pull Request，实现从需求到代码的端到端自动化开发。",
      en: "OpenAI's autonomous coding agent that independently plans tasks, writes code, runs tests and submits PRs in the cloud — end-to-end automated development from prompt to merge.",
    },
    region: "overseas",
    accent: "#10A37F",
    company: { zh: "OpenAI", en: "OpenAI" },
    tags: [
      { zh: "自主编码", en: "Autonomous" },
      { zh: "云端规划", en: "Cloud" },
      { zh: "PR 自动化", en: "PR Auto" },
    ],
  },
  {
    name: "WorkBuddy",
    url: "https://workbuddy.ai",
    logo: "/logos/workbuddy.ai.svg",
    category: "agent",
    desc: {
      zh: "面向办公场景的自主 Agent，可自动阅读与回复邮件、处理 Excel 表格数据、编排跨系统流程任务，大幅减轻日常重复性办公负担。",
      en: "An office-focused autonomous agent that automates email replies, spreadsheet processing and cross-system workflows — reducing daily repetitive office tasks significantly.",
    },
    region: "overseas",
    accent: "#7C3AED",
    company: { zh: "WorkBuddy", en: "WorkBuddy" },
    tags: [
      { zh: "办公自动化", en: "Office" },
      { zh: "邮件处理", en: "Email" },
      { zh: "任务流转", en: "Workflow" },
    ],
  },
  {
    name: "TraeSolo",
    url: "https://trae.ai/solo",
    category: "agent",
    desc: {
      zh: "Trae 的自主编码模式，用户只需输入需求描述，Agent 即可从零完成技术规划、代码编写、环境配置与调试，直接产出可运行项目，适合快速原型搭建。",
      en: "Trae's autonomous coding mode — just describe your idea, the agent handles planning, coding, config and debugging to produce a runnable project from scratch, ideal for rapid prototyping.",
    },
    region: "overseas",
    accent: "#0284C7",
    company: { zh: "字节跳动", en: "ByteDance" },
    tags: [
      { zh: "自主编码", en: "Autonomous" },
      { zh: "需求到项目", en: "Prompt-to-App" },
    ],
  },
  {
    name: "Monica",
    url: "https://monica.im",
    category: "agent",
    desc: {
      zh: "浏览器侧 AI 助手插件，支持网页内容智能摘要、划词翻译、写作润色与多模型自由对话，无需离开当前页面即可完成大部分信息处理工作。",
      en: "A browser-side AI assistant extension for smart page summaries, inline translations, writing polish and multi-model chat — handle most info tasks without leaving your current page.",
    },
    region: "overseas",
    accent: "#22C55E",
    company: { zh: "Monica", en: "Monica" },
    tags: [
      { zh: "浏览器插件", en: "Extension" },
      { zh: "网页摘要", en: "Summary" },
      { zh: "多模型", en: "Multi-Model" },
    ],
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "image",
    desc: {
      zh: "领先的 AI 图像生成工具，以艺术化的光影质感与独特视觉风格著称，广泛用于概念设计、插画创作与品牌视觉探索，社区活跃且风格迭代持续。",
      en: "A leading AI image generator renowned for its artistic lighting, unique visual aesthetics, and active community — widely used for concept art, illustration and brand exploration.",
    },
    region: "overseas",
    accent: "#1F1F1F",
    company: { zh: "Midjourney", en: "Midjourney" },
    tags: [
      { zh: "文生图", en: "Text-to-Image" },
      { zh: "艺术画风", en: "Artistic" },
      { zh: "创意设计", en: "Creative" },
    ],
  },
  {
    name: "DALL·E",
    url: "https://openai.com/dall-e",
    category: "image",
    desc: {
      zh: "OpenAI 的图像生成模型，支持自然语言描述生成高质量图片，并提供局部重绘（Inpainting）与外扩（Outpainting）等精细编辑能力，已整合进 ChatGPT。",
      en: "OpenAI's image model that generates high-quality images from text, with fine-grained inpainting and outpainting editing — now built into ChatGPT for seamless creation.",
    },
    region: "overseas",
    accent: "#12A150",
    company: { zh: "OpenAI", en: "OpenAI" },
    tags: [
      { zh: "文生图", en: "Text-to-Image" },
      { zh: "图像编辑", en: "Editing" },
      { zh: "风格多样", en: "Styling" },
    ],
  },
  {
    name: "Stable Diffusion",
    url: "https://stability.ai",
    category: "image",
    desc: {
      zh: "开源扩散模型，用户可完全本地部署与运行，支持自定义训练 LoRA/Checkpoint，拥有庞大的社区模型库与插件生态，图像生成高度可控可定制。",
      en: "An open-source diffusion model you can self-host fully, fine-tune with LoRA/Checkpoints, and tap into a massive community model library — offering unmatched control and customization.",
    },
    region: "overseas",
    accent: "#FF4F00",
    company: { zh: "Stability AI", en: "Stability AI" },
    tags: [
      { zh: "开源", en: "Open Source" },
      { zh: "本地部署", en: "Self-hosted" },
      { zh: "自定义模型", en: "Fine-tune" },
    ],
  },
  {
    name: "Adobe Firefly",
    url: "https://www.adobe.com/products/firefly.html",
    category: "image",
    desc: {
      zh: "Adobe 推出的商用安全生成式 AI 工具，训练数据均获版权授权，原生集成 Photoshop、Illustrator 等创意工具链，设计师可放心用于商业项目。",
      en: "Adobe's commercially-safe generative AI toolkit, trained on licensed data and natively integrated into Photoshop, Illustrator and Creative Cloud — built for worry-free commercial use.",
    },
    region: "overseas",
    accent: "#FF2D00",
    company: { zh: "Adobe", en: "Adobe" },
    tags: [
      { zh: "商用安全", en: "Commercial Safe" },
      { zh: "文生图", en: "Text-to-Image" },
      { zh: "Adobe 生态", en: "Adobe Ecosystem" },
    ],
  },
  {
    name: "Krea",
    url: "https://www.krea.ai",
    category: "image",
    desc: {
      zh: "实时 AI 图像创作工具，提供实时画布生成、图像增强与 AI 无损放大，延迟极低反馈即时，适合快速视觉探索、素材精修与创意灵感捕捉。",
      en: "A real-time AI image tool with live canvas generation, image enhancement and lossless upscaling — near-instant feedback for rapid visual exploration, refinement and creative sparks.",
    },
    region: "overseas",
    accent: "#111111",
    company: { zh: "Krea", en: "Krea" },
    tags: [
      { zh: "实时生成", en: "Real-time" },
      { zh: "图像增强", en: "Enhance" },
      { zh: "无损放大", en: "Upscale" },
    ],
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    category: "video",
    desc: {
      zh: "面向创作者的全能 AI 视频平台，支持文生视频、图生视频、视频风格迁移与专业级编辑调色，广泛应用于广告、电影预演与短视频创作。",
      en: "An all-in-one AI video platform for creators, supporting text-to-video, image-to-video, style transfer and professional editing — used widely in ads, film pre-vis and short-form content.",
    },
    region: "overseas",
    accent: "#00D8C4",
    company: { zh: "Runway", en: "Runway" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "视频编辑", en: "Editing" },
      { zh: "创作者工具", en: "Creator" },
    ],
  },
  {
    name: "Pika",
    url: "https://pika.art",
    category: "video",
    desc: {
      zh: "简单易上手的 AI 视频生成工具，支持文字或图片生成短视频，提供丰富风格化滤镜与局部修改功能，界面直观友好，适合社交媒体与个人内容创作。",
      en: "An easy-to-use AI video tool that turns text or images into short clips, with rich stylization filters and region editing — intuitive interface, perfect for social media creators.",
    },
    region: "overseas",
    accent: "#6C5CE7",
    company: { zh: "Pika Labs", en: "Pika Labs" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "风格化", en: "Styling" },
      { zh: "易上手", en: "Easy" },
    ],
  },
  {
    name: "Luma",
    url: "https://lumalabs.ai",
    category: "video",
    desc: {
      zh: "Dream Machine 文生视频模型，以画面连贯性、物理运动自然度与光影一致性著称，可在短时间内生成高画质视频片段，动作过渡流畅逼真。",
      en: "Dream Machine text-to-video model known for frame coherence, natural physics and consistent lighting — producing high-quality video clips with smooth, lifelike motion in minutes.",
    },
    region: "overseas",
    accent: "#5B5BD6",
    company: { zh: "Luma Labs", en: "Luma Labs" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "画面连贯", en: "Coherent" },
      { zh: "自然动作", en: "Natural" },
    ],
  },
  {
    name: "Sora",
    url: "https://sora.com",
    category: "video",
    desc: {
      zh: "OpenAI 的文生视频模型，支持生成长达一分钟的高保真视频，具备对物理世界运动规律、光影关系与场景延续性的深度理解，画质与一致性业界领先。",
      en: "OpenAI's text-to-video model generating up to one-minute high-fidelity clips, with deep understanding of physics, lighting and scene continuity — setting a new bar for quality and coherence.",
    },
    region: "overseas",
    accent: "#10A37F",
    company: { zh: "OpenAI", en: "OpenAI" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "长时序", en: "Long Duration" },
      { zh: "高保真", en: "High Fidelity" },
    ],
  },
  {
    name: "HeyGen",
    url: "https://www.heygen.com",
    category: "video",
    desc: {
      zh: "AI 数字人视频平台，用户上传或选择虚拟形象，输入文案即可自动生成带嘴型同步的多语言口播视频，广泛用于营销推广、企业培训与社交媒体内容。",
      en: "An AI avatar video platform — choose or upload an avatar, type a script, and get a lip-synced spokesperson video in multiple languages, perfect for marketing, training and social content.",
    },
    region: "overseas",
    accent: "#7C3AED",
    company: { zh: "HeyGen", en: "HeyGen" },
    tags: [
      { zh: "数字人", en: "Avatar" },
      { zh: "口播视频", en: "Spokesperson" },
      { zh: "文案生成", en: "Script-to-Video" },
    ],
  },
  {
    name: "Suno",
    url: "https://suno.com",
    category: "audio",
    desc: {
      zh: "AI 音乐生成平台，输入歌词或文字描述即可一键生成包含人声、伴奏的完整歌曲，支持多种音乐风格与情感表达，生成品质接近专业水准。",
      en: "An AI music platform that turns lyrics or text prompts into full songs with vocals and instrumentals in one click, supporting diverse genres and emotions — quality rivaling professional production.",
    },
    region: "overseas",
    accent: "#FF7A00",
    company: { zh: "Suno", en: "Suno" },
    tags: [
      { zh: "AI 音乐", en: "AI Music" },
      { zh: "歌词生成", en: "Lyrics" },
      { zh: "完整歌曲", en: "Full Song" },
    ],
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "audio",
    desc: {
      zh: "高拟真 AI 语音合成与克隆平台，只需少量音频样本即可复刻任何声音，支持 29 种语言的文本转语音与 AI 配音，效果自然逼真，广泛应用在有声书、播客与视频配音。",
      en: "A lifelike AI voice synthesis and cloning platform — clone any voice from short audio samples, with TTS and dubbing in 29 languages, widely used for audiobooks, podcasts and video voiceovers.",
    },
    region: "overseas",
    accent: "#111827",
    company: { zh: "ElevenLabs", en: "ElevenLabs" },
    tags: [
      { zh: "语音合成", en: "TTS" },
      { zh: "语音克隆", en: "Cloning" },
      { zh: "多语言", en: "Multilingual" },
    ],
  },
  {
    name: "Udio",
    url: "https://www.udio.com",
    category: "audio",
    desc: {
      zh: "新兴 AI 音乐生成平台，由前 DeepMind 研究员打造，以歌曲结构完整性、旋律优美度与音质保真度著称，可生成 30 秒至数分钟的完整曲目。",
      en: "An emerging AI music platform built by ex-DeepMind researchers, known for song structure integrity, melodic beauty and audio fidelity — generating full tracks from 30 seconds to several minutes.",
    },
    region: "overseas",
    accent: "#EC4899",
    company: { zh: "Udio", en: "Udio" },
    tags: [
      { zh: "AI 音乐", en: "AI Music" },
      { zh: "高质量", en: "High Quality" },
      { zh: "旋律创作", en: "Melody" },
    ],
  },
  {
    name: "Riffusion",
    url: "https://www.riffusion.com",
    category: "audio",
    desc: {
      zh: "基于 Stable Diffusion 扩散模型的实时音乐生成工具，将音频转化为频谱图再逆向合成，界面简洁直观，适合快速实验音乐创意与捕捉灵感片段。",
      en: "A real-time music generator built on Stable Diffusion — converts audio to spectrograms and back, with a clean, intuitive interface for quickly experimenting with musical ideas and capturing inspiration.",
    },
    region: "overseas",
    accent: "#8B5CF6",
    company: { zh: "Riffusion", en: "Riffusion" },
    tags: [
      { zh: "实时生成", en: "Real-time" },
      { zh: "扩散模型", en: "Diffusion" },
      { zh: "音乐创作", en: "Music" },
    ],
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co",
    category: "platform",
    desc: {
      zh: "全球最大的开源 AI 模型与数据集社区，托管数十万预训练模型与数据集，提供免费 GPU 推理与训练环境，被业界誉为「AI 领域的 GitHub」。",
      en: "The world's largest open-source AI hub hosting hundreds of thousands of models and datasets, with free GPU inference and training — widely known as the 'GitHub for AI'.",
    },
    region: "overseas",
    accent: "#FFB000",
    company: { zh: "Hugging Face", en: "Hugging Face" },
    tags: [
      { zh: "开源社区", en: "Open Source" },
      { zh: "模型库", en: "Models" },
      { zh: "数据集", en: "Datasets" },
    ],
  },
  {
    name: "Mistral",
    url: "https://mistral.ai",
    category: "platform",
    desc: {
      zh: "法国开源 AI 公司，以轻量高效的大模型著称，Mistral 7B / Mixtral 系列在同等参数规模下性能领先，支持本地部署与企业私有化，是欧洲 AI 的代表力量。",
      en: "A French open-source AI lab known for lightweight, efficient models — Mistral 7B / Mixtral lead their weight class in performance, supporting self-hosting and enterprise privacy as Europe's AI champion.",
    },
    region: "overseas",
    accent: "#FF7000",
    company: { zh: "Mistral AI", en: "Mistral AI" },
    tags: [
      { zh: "开源", en: "Open Source" },
      { zh: "高效模型", en: "Efficient" },
      { zh: "欧洲", en: "EU" },
    ],
  },

  // ──────────────── 国内（Domestic） ────────────────
  {
    name: "DeepSeek",
    url: "https://www.deepseek.com",
    category: "chat",
    desc: {
      zh: "深度求索推出的开源大模型，以极低的训练与推理成本实现接近顶尖闭源模型的性能，数学推理与编程能力突出，API 定价大幅低于同级别竞品，性价比极高。",
      en: "DeepSeek's open-source model achieving near-top-tier performance at a fraction of the cost — excelling in math, reasoning and coding with API pricing far below competitors.",
    },
    region: "domestic",
    accent: "#4D6BFE",
    company: { zh: "深度求索", en: "DeepSeek" },
    badge: { zh: "⭐ 推荐", en: "⭐ Recommend" },
    tags: [
      { zh: "开源", en: "Open Source" },
      { zh: "高性价比", en: "Cost-Effective" },
      { zh: "推理能力强", en: "Reasoning" },
    ],
  },
  {
    name: "Kimi",
    url: "https://kimi.moonshot.cn",
    category: "chat",
    desc: {
      zh: "月之暗面推出的长上下文助手，支持单次处理超长文档（最高数百万字），擅长论文精读、合同分析、长篇内容总结与多轮深度对话，中文理解细腻精准。",
      en: "Moonshot's long-context assistant handling millions of words in a single session — excels at paper analysis, contract review, long-form summarization and deep multi-turn conversations in Chinese.",
    },
    region: "domestic",
    accent: "#0B0B0B",
    company: { zh: "月之暗面", en: "Moonshot" },
    tags: [
      { zh: "长上下文", en: "Long Context" },
      { zh: "文档处理", en: "Documents" },
      { zh: "中文优化", en: "Chinese" },
    ],
  },
  {
    name: "豆包",
    url: "https://www.doubao.com",
    category: "chat",
    desc: {
      zh: "字节跳动旗下的综合 AI 助手，覆盖智能对话、内容创作、办公提效与学习辅导，深度接入抖音、飞书等字节生态产品，用户基数庞大且功能迭代迅速。",
      en: "ByteDance's all-in-one AI assistant covering chat, content creation, office productivity and tutoring — deeply integrated with Douyin, Feishu and the wider ByteDance ecosystem.",
    },
    region: "domestic",
    accent: "#FD4B55",
    company: { zh: "字节跳动", en: "ByteDance" },
    tags: [
      { zh: "智能对话", en: "AI Chat" },
      { zh: "内容创作", en: "Creation" },
      { zh: "办公助手", en: "Office" },
    ],
  },
  {
    name: "文心一言",
    url: "https://yiyan.baidu.com",
    category: "chat",
    desc: {
      zh: "百度推出的大语言模型，基于文心大模型系列，深度融合百度搜索引擎，在中文语义理解、知识问答与多模态内容生成场景有深厚积累和广泛落地。",
      en: "Baidu's LLM powered by the ERNIE series, deeply integrated with Baidu Search — strong Chinese semantic understanding, knowledge Q&A and multimodal content generation with broad deployment.",
    },
    region: "domestic",
    accent: "#2932E1",
    company: { zh: "百度", en: "Baidu" },
    tags: [
      { zh: "中文优化", en: "Chinese" },
      { zh: "搜索融合", en: "Search" },
      { zh: "多模态", en: "Multimodal" },
    ],
  },
  {
    name: "通义千问",
    url: "https://tongyi.aliyun.com",
    category: "chat",
    desc: {
      zh: "阿里云自研的大模型系列，覆盖对话、编码、数学推理与多模态理解，与阿里云产品深度集成，提供从模型训练、微调到部署的全栈 AI 服务。",
      en: "Alibaba Cloud's in-house model series spanning chat, coding, math reasoning and multimodal understanding — deeply integrated with cloud services, offering full-stack AI from training to deployment.",
    },
    region: "domestic",
    accent: "#615CED",
    company: { zh: "阿里云", en: "Alibaba Cloud" },
    tags: [
      { zh: "对话", en: "Chat" },
      { zh: "编码", en: "Coding" },
      { zh: "多模态", en: "Multimodal" },
    ],
  },
  {
    name: "智谱清言",
    url: "https://chatglm.cn",
    category: "chat",
    desc: {
      zh: "清华系智谱 AI 基于 GLM 架构打造的对话助手，在中文逻辑推理、长篇写作与知识问答方面表现均衡，技术底蘊深厚，是国内大模型赛道的重要玩家。",
      en: "Tsinghua-backed Zhipu AI's GLM-powered assistant — balanced performance in Chinese reasoning, long-form writing and knowledge Q&A, a key player in China's LLM landscape with deep research roots.",
    },
    region: "domestic",
    accent: "#4F46E5",
    company: { zh: "智谱 AI", en: "Zhipu AI" },
    tags: [
      { zh: "中文推理", en: "Chinese Reasoning" },
      { zh: "清华系", en: "Tsinghua" },
      { zh: "GLM 模型", en: "GLM" },
    ],
  },
  {
    name: "讯飞星火",
    url: "https://xinghuo.xfyun.cn",
    category: "chat",
    desc: {
      zh: "科大讯飞推出的认知大模型，继承讯飞二十余年语音技术积累，在语音识别、合成与多方言支持方面具有显著优势，特别适合语音交互为主的场景。",
      en: "iFlytek's cognitive model leveraging 20+ years of speech tech expertise — standout advantages in voice recognition, synthesis and multi-dialect support, ideal for voice-first interaction scenarios.",
    },
    region: "domestic",
    accent: "#1F5EFF",
    company: { zh: "科大讯飞", en: "iFlytek" },
    tags: [
      { zh: "语音能力", en: "Speech" },
      { zh: "认知模型", en: "Cognitive" },
      { zh: "中文场景", en: "Chinese" },
    ],
  },
  {
    name: "百川智能",
    url: "https://www.baichuan-ai.com",
    category: "chat",
    desc: {
      zh: "王小川创立的大模型公司，聚焦通用人工智能研发，同时面向金融、医疗、教育等行业推出垂直领域模型与解决方案，注重场景落地与商业化应用。",
      en: "Founded by Wang Xiaochuan, this AI company focuses on AGI research while delivering vertical models and solutions for finance, healthcare and education — emphasizing real-world deployment.",
    },
    region: "domestic",
    accent: "#3B5BFF",
    company: { zh: "百川智能", en: "Baichuan" },
    tags: [
      { zh: "通用对话", en: "General" },
      { zh: "行业场景", en: "Industry" },
    ],
  },
  {
    name: "腾讯混元",
    url: "https://hunyuan.tencent.com",
    category: "chat",
    desc: {
      zh: "腾讯自研的大模型，已深度接入微信搜一搜、腾讯文档、腾讯会议等核心产品，在文生图与多模态理解上持续迭代，链接腾讯庞大的社交与内容生态。",
      en: "Tencent's in-house model deeply integrated into WeChat Search, Tencent Docs, Meeting and more — continuously improving text-to-image and multimodal capabilities across Tencent's massive ecosystem.",
    },
    region: "domestic",
    accent: "#0052D9",
    company: { zh: "腾讯", en: "Tencent" },
    tags: [
      { zh: "微信生态", en: "WeChat" },
      { zh: "自研模型", en: "In-house" },
      { zh: "多模态", en: "Multimodal" },
    ],
  },
  {
    name: "元宝",
    url: "https://yuanbao.tencent.com",
    category: "chat",
    desc: {
      zh: "腾讯基于自研混元大模型打造的 C 端 AI 助手，深度融合微信公众号、视频号等腾讯生态信源，支持混元与 DeepSeek 双模型一键切换、联网搜索、智能识图与拍题答疑，覆盖工作、学习与日常场景。",
      en: "Tencent's consumer AI assistant built on the in-house Hunyuan model, deeply integrating WeChat official accounts and Channels — supports one-click switching between Hunyuan and DeepSeek, web search, image understanding and photo-based Q&A for work, study and daily life.",
    },
    region: "domestic",
    accent: "#1677FF",
    company: { zh: "腾讯", en: "Tencent" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "智能对话", en: "AI Chat" },
      { zh: "生态搜索", en: "Search" },
      { zh: "双模型", en: "Dual Model" },
    ],
  },
  {
    name: "阶跃星辰",
    url: "https://www.stepfun.com",
    category: "chat",
    desc: {
      zh: "专注 AGI 的创业公司，多模态模型迭代速度极快，已开源多个参数规模的模型，在图像理解与生成方面有独特技术积累，是国产大模型的快速迭代代表。",
      en: "An AGI-focused startup iterating multimodal models at breakneck speed — has open-sourced models at multiple scales with unique strengths in vision understanding and generation.",
    },
    region: "domestic",
    accent: "#2B2B2B",
    company: { zh: "阶跃星辰", en: "StepFun" },
    tags: [
      { zh: "AGI 探索", en: "AGI" },
      { zh: "多模态", en: "Multimodal" },
      { zh: "迭代快速", en: "Fast Iteration" },
    ],
  },
  {
    name: "天工",
    url: "https://www.tiangong.cn",
    category: "chat",
    desc: {
      zh: "昆仑万维推出的 AI 助手，集成搜索与创作能力于一体，支持实时联网获取信息并在对话中直接生成文章、方案等结构化内容，中文搜索体验流畅。",
      en: "Kunlun's AI assistant combining search and content creation — with real-time web access, it generates articles, proposals and structured content directly within conversations.",
    },
    region: "domestic",
    accent: "#FF6A00",
    company: { zh: "昆仑万维", en: "Kunlun" },
    tags: [
      { zh: "搜索一体", en: "Search" },
      { zh: "内容创作", en: "Creation" },
      { zh: "中文优化", en: "Chinese" },
    ],
  },
  {
    name: "海螺AI",
    url: "https://hailuoai.com",
    category: "chat",
    desc: {
      zh: "MiniMax 出品的 AI 助手，以语音合成与视频生成为差异化亮点，支持角色配音、情感语音与短视频自动生成，娱乐属性强且交互体验生动有趣。",
      en: "MiniMax's AI assistant with standout voice synthesis and video generation — supporting character voiceovers, emotional speech and short-video creation with a fun, engaging user experience.",
    },
    region: "domestic",
    accent: "#6D28D9",
    company: { zh: "MiniMax", en: "MiniMax" },
    tags: [
      { zh: "语音生成", en: "Voice" },
      { zh: "视频生成", en: "Video" },
      { zh: "多模态", en: "Multimodal" },
    ],
  },
  {
    name: "秘塔AI搜索",
    url: "https://metaso.cn",
    category: "search",
    desc: {
      zh: "无广告的 AI 搜索引擎，输入问题后直接返回结构化分析报告与引用来源，支持学术检索与深度研究模式，界面极简无干扰，被誉为中文 AI 搜索的标杆产品。",
      en: "An ad-free AI search engine that returns structured reports with cited sources, supporting academic retrieval and deep research mode — a benchmark for Chinese AI search with a clean, distraction-free UI.",
    },
    region: "domestic",
    accent: "#2F54EB",
    company: { zh: "秘塔科技", en: "Metaso" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "无广告", en: "Ad-Free" },
      { zh: "结构化", en: "Structured" },
      { zh: "来源引用", en: "Citations" },
    ],
  },
  {
    name: "通义灵码",
    url: "https://tongyi.aliyun.com/lingma",
    category: "dev",
    desc: {
      zh: "阿里云推出的 AI 编程助手，具备整库代码理解能力，支持行级/函数级代码补全、自然语言生成代码、自动生成单元测试与代码解释，提升研发全流程效率。",
      en: "Alibaba Cloud's AI coding assistant with repo-wide code understanding, offering line/function-level completion, natural language code generation, auto unit test creation and code explanations.",
    },
    region: "domestic",
    accent: "#615CED",
    company: { zh: "阿里云", en: "Alibaba Cloud" },
    tags: [
      { zh: "整库理解", en: "Repo-wide" },
      { zh: "智能生成", en: "Generation" },
      { zh: "IDE 集成", en: "IDE" },
    ],
  },
  {
    name: "文心快码（Baidu Comate）",
    url: "https://comate.baidu.com",
    category: "dev",
    desc: {
      zh: "百度基于文心大模型打造的智能编码助手，覆盖代码实时补全、自然语言生成代码、代码质量检查与智能问答，兼容 VS Code、JetBrains 等多款主流 IDE。",
      en: "Baidu's smart coding assistant powered by the ERNIE model, covering real-time completion, natural language code generation, quality checks and Q&A — compatible with VS Code, JetBrains and more.",
    },
    region: "domestic",
    accent: "#2932E1",
    company: { zh: "百度", en: "Baidu" },
    tags: [
      { zh: "代码补全", en: "Completion" },
      { zh: "代码生成", en: "Generation" },
      { zh: "代码问答", en: "Q&A" },
    ],
  },
  {
    name: "CodeGeeX",
    url: "https://codegeex.cn",
    category: "dev",
    desc: {
      zh: "智谱 AI 与清华大学联合推出的 AI 编程助手，支持代码生成与补全、代码翻译、智能问答，提供 IDE 插件与开放平台，支持 100+ 编程语言。",
      en: "Zhipu AI & Tsinghua University's AI coding assistant with code generation, completion, translation and Q&A, offering IDE plugins and an open platform supporting 100+ languages.",
    },
    region: "domestic",
    accent: "#4F46E5",
    company: { zh: "智谱 AI", en: "Zhipu AI" },
    tags: [
      { zh: "代码生成", en: "Generation" },
      { zh: "代码补全", en: "Completion" },
      { zh: "代码翻译", en: "Translation" },
    ],
  },
  {
    name: "Google Antigravity",
    url: "https://antigravity.google",
    logo: "/logos/antigravity.google.png",
    category: "dev",
    desc: {
      zh: "Google 推出的 Agent-first 智能体开发平台与 AI IDE，基于 Gemini，提供 Tab 级自动补全、自然语言代码指令与上下文感知的多智能体协作能力，让开发者以智能体优先的方式构建软件。",
      en: "Google's agent-first development platform and AI IDE powered by Gemini, offering tab autocompletion, natural-language code commands and context-aware multi-agent collaboration for building software in the agent era.",
    },
    region: "overseas",
    accent: "#4285F4",
    company: { zh: "Google", en: "Google" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "AI IDE", en: "AI IDE" },
      { zh: "多智能体", en: "Multi-Agent" },
      { zh: "Gemini", en: "Gemini" },
    ],
  },
  {
    name: "Qoder CN",
    url: "https://www.aliyun.com/product/qodercn",
    logo: "/logos/qoder.com.svg",
    category: "dev",
    desc: {
      zh: "阿里云推出的新一代 Agentic 编码平台（原通义灵码），基于增强上下文工程与知识可视化、Spec 驱动开发，提供 Agent 模式与 Quest 能力，深度理解整个代码库架构并记忆开发习惯。",
      en: "Alibaba Cloud's next-generation agentic coding platform (formerly Tongyi Lingma), built on augmented context engineering and knowledge visualization with spec-driven development, offering Agent Mode and Quest to deeply understand your codebase.",
    },
    region: "domestic",
    accent: "#FF6A00",
    company: { zh: "阿里云", en: "Alibaba Cloud" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "Agentic IDE", en: "Agentic IDE" },
      { zh: "代码库理解", en: "Codebase" },
      { zh: "Spec 驱动", en: "Spec-driven" },
    ],
  },
  {
    name: "豆包 MarsCode",
    url: "https://www.marscode.cn",
    category: "dev",
    desc: {
      zh: "字节跳动推出的免费 AI 编程助手，提供代码补全、智能问答、云端 IDE 等能力，支持多种编程语言与主流 IDE，深度集成豆包大模型。",
      en: "ByteDance's free AI coding assistant providing code completion, intelligent Q&A and cloud IDE, supporting multiple languages and mainstream IDEs with deep Doubao model integration.",
    },
    region: "domestic",
    accent: "#1677FF",
    company: { zh: "字节跳动", en: "ByteDance" },
    tags: [
      { zh: "免费", en: "Free" },
      { zh: "云 IDE", en: "Cloud IDE" },
      { zh: "代码补全", en: "Completion" },
    ],
  },
  {
    name: "MiMo Code",
    url: "https://github.com/XiaomiMiMo/MiMo-Code",
    logo: "/logos/github.com.png",
    category: "dev",
    desc: {
      zh: "小米 MiMo 团队开源的终端原生 AI 编程智能体（Coding Agent），基于开源项目 OpenCode 二次开发并以 MIT 协议发布，支持读写代码、执行命令、管理 Git 与持久化记忆，模型与 Agent 协同进化。",
      en: "Xiaomi MiMo team's open-source terminal-native coding agent built on OpenCode and released under MIT — reads/writes code, runs commands, manages Git and keeps persistent memory, with models and agents co-evolving.",
    },
    region: "domestic",
    accent: "#7C3AED",
    company: { zh: "小米 MiMo", en: "Xiaomi MiMo" },
    badge: { zh: "⭐ 开源", en: "⭐ Open Source" },
    tags: [
      { zh: "开源 MIT", en: "Open Source" },
      { zh: "终端 Agent", en: "Terminal Agent" },
      { zh: "持久记忆", en: "Memory" },
    ],
  },
  {
    name: "Kiro",
    url: "https://kiro.dev",
    logo: "/logos/kiro.dev.png",
    category: "dev",
    desc: {
      zh: "AWS 推出的 Spec-driven AI IDE（2026 年替代 Amazon Q Developer），将需求转化为可执行规格，自动校验代码正确性、修复 Bug 并迭代功能，让 Vibe Coding 走向工程化。",
      en: "AWS's spec-driven AI IDE (replacing Amazon Q Developer in 2026) that turns prompts into executable specs, validates code correctness, fixes bugs and iterates features — bringing Vibe Coding to engineering rigor.",
    },
    region: "overseas",
    accent: "#14B8A6",
    company: { zh: "AWS", en: "AWS" },
    tags: [
      { zh: "Spec 驱动", en: "Spec-driven" },
      { zh: "AI IDE", en: "AI IDE" },
      { zh: "代码校验", en: "Validation" },
    ],
  },
  {
    name: "Claude Code",
    url: "https://code.claude.com",
    logo: "/logos/claude.ai.png",
    category: "dev",
    desc: {
      zh: "Anthropic 推出的终端原生 AI 编程智能体，深度理解整个代码库，可直接编辑文件、执行命令、管理 Git 并自主完成功能开发、Bug 修复与开发任务自动化。",
      en: "Anthropic's terminal-native coding agent that understands your entire codebase, edits files, runs commands, manages Git and autonomously ships features, fixes bugs and automates dev tasks.",
    },
    region: "overseas",
    accent: "#D97757",
    company: { zh: "Anthropic", en: "Anthropic" },
    badge: { zh: "🔥 热门", en: "🔥 Hot" },
    tags: [
      { zh: "终端 Agent", en: "Terminal Agent" },
      { zh: "代码库理解", en: "Codebase" },
      { zh: "任务自动化", en: "Automation" },
    ],
  },
  {
    name: "智谱 AutoGLM",
    url: "https://chatglm.cn",
    category: "agent",
    desc: {
      zh: "智谱推出的手机与浏览器自主智能体，可模拟人工操作完成多步复杂任务，如自动订票、比价下单、信息采集等，解放重复操作，让 AI 真正代替人动手。",
      en: "Zhipu's autonomous agent for phones and browsers that simulates human actions to complete multi-step tasks — auto booking, price comparison, data collection, truly letting AI do the work.",
    },
    region: "domestic",
    accent: "#4F46E5",
    company: { zh: "智谱 AI", en: "Zhipu AI" },
    tags: [
      { zh: "自主 Agent", en: "Autonomous" },
      { zh: "手机操控", en: "Phone Control" },
      { zh: "多步任务", en: "Multi-step" },
    ],
  },
  {
    name: "Coze（扣子）",
    url: "https://www.coze.cn",
    category: "agent",
    desc: {
      zh: "字节的 AI Agent 搭建平台，提供可视化流程编排、知识库管理、插件市场与多渠道发布能力，零代码即可搭建功能完善的智能 Bot，大幅降低 AI 应用开发门槛。",
      en: "ByteDance's AI agent builder with visual workflow orchestration, knowledge base management, plugin marketplace and multi-channel publishing — build smart bots with zero code.",
    },
    region: "domestic",
    accent: "#7B61FF",
    company: { zh: "字节跳动", en: "ByteDance" },
    badge: { zh: "聚合平台", en: "Aggregator" },
    tags: [
      { zh: "可视化编排", en: "Visual" },
      { zh: "一键发布", en: "One-click" },
      { zh: "多渠道", en: "Multi-channel" },
    ],
  },
  {
    name: "Manus",
    url: "https://manus.im",
    category: "agent",
    desc: {
      zh: "通用自主 Agent，能将复杂任务自动拆解为多步骤并逐一执行，覆盖深度研究、数据分析、文档撰写与流程自动化等专业场景，是国内自主 Agent 的代表产品。",
      en: "A general autonomous agent that breaks down complex tasks into steps and executes them — covering deep research, data analysis, document writing and workflow automation, a leading Chinese agent product.",
    },
    region: "domestic",
    accent: "#111827",
    company: { zh: "Manus", en: "Manus" },
    badge: { zh: "⭐ 推荐", en: "⭐ Recommend" },
    tags: [
      { zh: "自主 Agent", en: "Autonomous" },
      { zh: "任务拆解", en: "Planning" },
      { zh: "多场景", en: "Multi-domain" },
    ],
  },
  {
    name: "通义万相",
    url: "https://tongyi.aliyun.com/wanxiang",
    category: "image",
    desc: {
      zh: "阿里云推出的文生图与图像编辑模型，擅长中国传统美学风格与商用设计素材生成，支持文字渲染与多轮精细化修改，满足品牌设计、电商与宣传物料的创意需求。",
      en: "Alibaba Cloud's text-to-image and editing model specializing in Chinese traditional aesthetics and commercial design assets, with text rendering and iterative refinement for branding and e-commerce.",
    },
    region: "domestic",
    accent: "#615CED",
    company: { zh: "阿里云", en: "Alibaba Cloud" },
    tags: [
      { zh: "文生图", en: "Text-to-Image" },
      { zh: "国风", en: "Chinese Style" },
      { zh: "商用素材", en: "Commercial" },
    ],
  },
  {
    name: "文心一格",
    url: "https://yige.baidu.com",
    category: "image",
    desc: {
      zh: "百度推出的 AI 艺术与创意绘画平台，支持多种艺术风格出图，对中文提示词语义理解精准，适合国风插画、海报设计、产品视觉与创意灵感的快速生成。",
      en: "Baidu's AI art and creative painting platform with multi-style generation and precise Chinese prompt understanding — ideal for Chinese-style illustration, posters, product visuals and rapid creative ideation.",
    },
    region: "domestic",
    accent: "#2932E1",
    company: { zh: "百度", en: "Baidu" },
    tags: [
      { zh: "AI 绘画", en: "AI Art" },
      { zh: "多风格", en: "Multi-style" },
      { zh: "中文提示词", en: "Chinese Prompt" },
    ],
  },
  {
    name: "即梦",
    url: "https://dreamina.capcut.com",
    category: "image",
    desc: {
      zh: "字节旗下剪映团队打造的一站式 AI 创作平台，覆盖文生图、图生视频与智能剪辑，与剪映深度联动，适合短视频内容创作者快速产出视觉素材。",
      en: "ByteDance's all-in-one AI creative platform by the CapCut team, covering text-to-image, image-to-video and smart editing — deeply linked with CapCut for short-video creators to produce visuals fast.",
    },
    region: "domestic",
    accent: "#7B61FF",
    company: { zh: "字节跳动", en: "ByteDance" },
    tags: [
      { zh: "一站式", en: "All-in-One" },
      { zh: "文生图", en: "Text-to-Image" },
      { zh: "图生视频", en: "Image-to-Video" },
    ],
  },
  {
    name: "可灵",
    url: "https://klingai.com",
    category: "video",
    desc: {
      zh: "快手推出的文生视频大模型，以人物动作自然流畅、物理效果逼真著称，支持生成高画质短视频，已向全球创作者开放使用，是国内视频生成领域的标杆产品。",
      en: "Kuaishou's text-to-video model known for natural character motion and lifelike physics — producing high-quality short clips, now open to global creators and a benchmark for Chinese video generation.",
    },
    region: "domestic",
    accent: "#FF5000",
    company: { zh: "快手", en: "Kuaishou" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "动作自然", en: "Lifelike" },
      { zh: "高质量", en: "High Quality" },
    ],
  },
  {
    name: "Vidu",
    url: "https://www.vidu.com",
    logo: "/logos/www.vidu.com.svg",
    category: "video",
    desc: {
      zh: "生数科技推出的 AI 视频生成模型，国内首个纯自研视频大模型，支持文生视频、图生视频与多镜头故事板，擅长保持主体一致性与电影级画面质感，长视频生成达到国际顶尖水平。",
      en: "Shengshu Technology's AI video model — China's first fully self-developed video foundation model, supporting text-to-video, image-to-video and multi-shot storyboards with strong subject consistency and cinematic quality, leading globally in long-form generation.",
    },
    region: "domestic",
    accent: "#6D5BFF",
    company: { zh: "生数科技", en: "Shengshu Tech" },
    badge: { zh: "⭐ 推荐", en: "⭐ Recommend" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "主体一致", en: "Consistency" },
      { zh: "多镜头", en: "Storyboard" },
    ],
  },
  {
    name: "智谱清影",
    url: "https://chatglm.cn/video",
    logo: "/logos/chatglm.cn.png",
    category: "video",
    desc: {
      zh: "智谱 AI 推出的 AI 视频生成模型，支持文生视频与图生视频，可生成高画质、高帧率视频，并具备电影级运镜与多镜头连贯叙事能力，是国产视频大模型的重要代表。",
      en: "Zhipu AI's AI video generation model supporting text-to-video and image-to-video with high-resolution, high-frame-rate output, cinematic camera movement and coherent multi-shot storytelling — a key representative of China's video foundation models.",
    },
    region: "domestic",
    accent: "#6366F1",
    company: { zh: "智谱 AI", en: "Zhipu AI" },
    tags: [
      { zh: "文生视频", en: "Text-to-Video" },
      { zh: "图生视频", en: "Image-to-Video" },
      { zh: "电影运镜", en: "Cinematic" },
    ],
  },
];
