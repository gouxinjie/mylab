/**
 * @file ai-products.ts
 * @description 市面上主流 AI 产品展示数据（仅作展示，链接均为官方站点）
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-16
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
  dev: { zh: "开发工具", en: "Dev Tools" },
  agent: { zh: "Agent 工具", en: "AI Agents" },
  image: { zh: "文生图", en: "Image" },
  video: { zh: "文生视频", en: "Video" },
  audio: { zh: "音乐 & 音频", en: "Music & Audio" },
  platform: { zh: "模型 & 平台", en: "Models & Platform" },
};

/** Tab 展示顺序（首项为「全部」） */
export const categoryOrder: (AiCategory | "all")[] = [
  "all",
  "chat",
  "search",
  "dev",
  "agent",
  "image",
  "video",
  "audio",
  "platform",
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
  /** 头像底色（品牌色） */
  accent: string;
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
      zh: "OpenAI 推出的通用对话助手，支持写作、分析与代码。",
      en: "OpenAI's general-purpose assistant for writing, analysis and coding.",
    },
    region: "overseas",
    accent: "#10A37F",
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "chat",
    desc: {
      zh: "Anthropic 出品的对话模型，以长文本理解与严谨推理见长。",
      en: "Anthropic's model strong at long-context understanding and careful reasoning.",
    },
    region: "overseas",
    accent: "#D97757",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "chat",
    desc: {
      zh: "谷歌的多模态大模型，深度整合搜索与生态。",
      en: "Google's multimodal model deeply integrated with Search and its ecosystem.",
    },
    region: "overseas",
    accent: "#4285F4",
  },
  {
    name: "Grok",
    url: "https://grok.com",
    category: "chat",
    desc: {
      zh: "马斯克 xAI 推出的对话模型，实时联网并带幽默风格。",
      en: "xAI's conversational model with real-time web access and a witty tone.",
    },
    region: "overseas",
    accent: "#111111",
  },
  {
    name: "Poe",
    url: "https://poe.com",
    category: "chat",
    desc: {
      zh: "Quora 推出的聚合平台，可一键切换多种主流模型。",
      en: "Quora's hub that lets you chat with multiple top models in one place.",
    },
    region: "overseas",
    accent: "#B92B27",
  },
  {
    name: "Character.AI",
    url: "https://character.ai",
    category: "chat",
    desc: {
      zh: "可创建并对话虚拟角色的 AI 陪伴平台。",
      en: "A platform to create and chat with virtual AI characters.",
    },
    region: "overseas",
    accent: "#5C5CE6",
  },
  {
    name: "Meta AI",
    url: "https://www.meta.ai",
    category: "chat",
    desc: {
      zh: "Meta 的通用助手，深度集成社交与智能眼镜生态。",
      en: "Meta's general assistant wired into social and smart-glasses ecosystems.",
    },
    region: "overseas",
    accent: "#0866FF",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "search",
    desc: {
      zh: "对话式 AI 搜索引擎，给出带引用来源的答案。",
      en: "A conversational AI search engine that answers with cited sources.",
    },
    region: "overseas",
    accent: "#20808D",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    category: "dev",
    desc: {
      zh: "基于 AI 的代码编辑器，深度理解整个代码库。",
      en: "An AI-first code editor that understands your whole codebase.",
    },
    region: "overseas",
    accent: "#000000",
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "dev",
    desc: {
      zh: "GitHub 与 OpenAI 合作的编程助手，IDE 内实时补全。",
      en: "GitHub and OpenAI's in-IDE pair programmer with live completion.",
    },
    region: "overseas",
    accent: "#6E5494",
  },
  {
    name: "Trae",
    url: "https://trae.ai",
    category: "dev",
    desc: {
      zh: "字节跳动推出的 AI IDE，内置对话与智能补全，人主导编码。",
      en: "ByteDance's AI IDE with chat and smart completion — human-led coding.",
    },
    region: "overseas",
    accent: "#0EA5E9",
  },
  {
    name: "CedeBuddy",
    url: "https://cedebuddy.com",
    category: "dev",
    desc: {
      zh: "AI 编码助手，理解项目上下文并提供实时补全与答疑。",
      en: "An AI coding buddy that understands your project and offers live completion and Q&A.",
    },
    region: "overseas",
    accent: "#2F80ED",
  },
  {
    name: "Amazon CodeWhisperer",
    url: "https://aws.amazon.com/q/developer/",
    category: "dev",
    desc: {
      zh: "AWS 的 AI 编程助手，深度集成云开发与安全检查。",
      en: "AWS's coding assistant with cloud-dev integration and security scans.",
    },
    region: "overseas",
    accent: "#FF9900",
  },
  {
    name: "Codex",
    url: "https://openai.com/codex",
    category: "agent",
    desc: {
      zh: "OpenAI 的自主编码 Agent，可在云端独立规划、写代码与提交 PR。",
      en: "OpenAI's autonomous coding agent that plans, writes code and opens PRs in the cloud.",
    },
    region: "overseas",
    accent: "#10A37F",
  },
  {
    name: "WorkBuddy",
    url: "https://workbuddy.ai",
    category: "agent",
    desc: {
      zh: "面向办公场景的自主 Agent，可自动处理邮件、表格与流程任务。",
      en: "An office-focused autonomous agent that automates email, spreadsheets and workflows.",
    },
    region: "overseas",
    accent: "#7C3AED",
  },
  {
    name: "TraeSolo",
    url: "https://trae.ai/solo",
    category: "agent",
    desc: {
      zh: "Trae 的自主编码模式，能从需求到可运行项目独立完成。",
      en: "Trae's autonomous coding mode that builds runnable projects from a prompt.",
    },
    region: "overseas",
    accent: "#0284C7",
  },
  {
    name: "Monica",
    url: "https://monica.im",
    category: "agent",
    desc: {
      zh: "浏览器侧 AI 助手，可自主处理网页摘要、写作与多模型对话。",
      en: "A browser-side AI assistant for page summaries, writing and multi-model chat.",
    },
    region: "overseas",
    accent: "#22C55E",
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "image",
    desc: {
      zh: "领先的 AI 图像生成工具，以艺术化画风著称。",
      en: "A leading AI image generator known for its artistic style.",
    },
    region: "overseas",
    accent: "#1F1F1F",
  },
  {
    name: "DALL·E",
    url: "https://openai.com/dall-e",
    category: "image",
    desc: {
      zh: "OpenAI 的图像生成模型，支持文生图与图像编辑。",
      en: "OpenAI's image model for text-to-image and inpainting.",
    },
    region: "overseas",
    accent: "#12A150",
  },
  {
    name: "Stable Diffusion",
    url: "https://stability.ai",
    category: "image",
    desc: {
      zh: "开源扩散模型，可本地部署并高度自定义出图。",
      en: "An open-source diffusion model you can self-host and fine-tune.",
    },
    region: "overseas",
    accent: "#FF4F00",
  },
  {
    name: "Adobe Firefly",
    url: "https://www.adobe.com/products/firefly.html",
    category: "image",
    desc: {
      zh: "Adobe 商用安全的生成式图像与视频工具。",
      en: "Adobe's commercially-safe generative image and video toolkit.",
    },
    region: "overseas",
    accent: "#FF2D00",
  },
  {
    name: "Krea",
    url: "https://www.krea.ai",
    category: "image",
    desc: {
      zh: "实时 AI 图像工具，支持生成、增强与无损放大。",
      en: "Real-time AI image tool for generation, enhancement and upscaling.",
    },
    region: "overseas",
    accent: "#111111",
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    category: "video",
    desc: {
      zh: "面向创作者的 AI 视频生成与编辑工具。",
      en: "AI video generation and editing tools built for creators.",
    },
    region: "overseas",
    accent: "#00D8C4",
  },
  {
    name: "Pika",
    url: "https://pika.art",
    category: "video",
    desc: {
      zh: "易上手的文生视频工具，支持风格化与局部修改。",
      en: "An easy text-to-video tool with styling and region editing.",
    },
    region: "overseas",
    accent: "#6C5CE7",
  },
  {
    name: "Luma",
    url: "https://lumalabs.ai",
    category: "video",
    desc: {
      zh: "Dream Machine 文生视频，画面连贯且动作自然。",
      en: "Dream Machine turns prompts into coherent, natural-motion video.",
    },
    region: "overseas",
    accent: "#5B5BD6",
  },
  {
    name: "Sora",
    url: "https://sora.com",
    category: "video",
    desc: {
      zh: "OpenAI 的文生视频模型，可生成长时序、高保真视频。",
      en: "OpenAI's text-to-video model for long, high-fidelity clips.",
    },
    region: "overseas",
    accent: "#10A37F",
  },
  {
    name: "HeyGen",
    url: "https://www.heygen.com",
    category: "video",
    desc: {
      zh: "AI 数字人视频平台，输入文案即可生成口播视频。",
      en: "AI avatar video platform that turns scripts into spokesperson clips.",
    },
    region: "overseas",
    accent: "#7C3AED",
  },
  {
    name: "Suno",
    url: "https://suno.com",
    category: "audio",
    desc: {
      zh: "AI 音乐生成平台，输入歌词即可生成完整歌曲。",
      en: "An AI music platform that turns prompts into full songs.",
    },
    region: "overseas",
    accent: "#FF7A00",
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "audio",
    desc: {
      zh: "高拟真 AI 语音合成与克隆，支持多语言配音。",
      en: "Lifelike AI voice synthesis and cloning with multilingual dubbing.",
    },
    region: "overseas",
    accent: "#111827",
  },
  {
    name: "Udio",
    url: "https://www.udio.com",
    category: "audio",
    desc: {
      zh: "AI 音乐生成平台，以高质量歌曲与旋律著称。",
      en: "An AI music platform known for high-quality songs and melodies.",
    },
    region: "overseas",
    accent: "#EC4899",
  },
  {
    name: "Riffusion",
    url: "https://www.riffusion.com",
    category: "audio",
    desc: {
      zh: "基于扩散模型的音乐生成工具，实时创作片段。",
      en: "A diffusion-based music generator for real-time clips.",
    },
    region: "overseas",
    accent: "#8B5CF6",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co",
    category: "platform",
    desc: {
      zh: "开源模型与数据集社区，被称为「AI 的 GitHub」。",
      en: "The open-source hub for models and datasets — 'GitHub for AI'.",
    },
    region: "overseas",
    accent: "#FFB000",
  },
  {
    name: "Mistral",
    url: "https://mistral.ai",
    category: "platform",
    desc: {
      zh: "欧洲开源大模型厂商，以高效小模型著称。",
      en: "A European open-weight lab known for efficient small models.",
    },
    region: "overseas",
    accent: "#FF7000",
  },

  // ──────────────── 国内（Domestic） ────────────────
  {
    name: "DeepSeek",
    url: "https://www.deepseek.com",
    category: "chat",
    desc: {
      zh: "国产开源大模型，以高性价比与推理能力著称。",
      en: "An open-weight model known for strong reasoning at low cost.",
    },
    region: "domestic",
    accent: "#4D6BFE",
  },
  {
    name: "Kimi",
    url: "https://kimi.moonshot.cn",
    category: "chat",
    desc: {
      zh: "月之暗面推出的长上下文助手，擅长长文档处理。",
      en: "Moonshot's long-context assistant that excels at long documents.",
    },
    region: "domestic",
    accent: "#0B0B0B",
  },
  {
    name: "豆包",
    url: "https://www.doubao.com",
    category: "chat",
    desc: {
      zh: "字节跳动旗下的 AI 助手，覆盖对话、创作与办公。",
      en: "ByteDance's assistant covering chat, creation and office tasks.",
    },
    region: "domestic",
    accent: "#FD4B55",
  },
  {
    name: "文心一言",
    url: "https://yiyan.baidu.com",
    category: "chat",
    desc: {
      zh: "百度推出的中文大模型，深度融合搜索与中文场景。",
      en: "Baidu's Chinese model deeply integrated with search.",
    },
    region: "domestic",
    accent: "#2932E1",
  },
  {
    name: "通义千问",
    url: "https://tongyi.aliyun.com",
    category: "chat",
    desc: {
      zh: "阿里云的大模型，覆盖对话、编码与多模态。",
      en: "Alibaba Cloud's model spanning chat, coding and multimodal.",
    },
    region: "domestic",
    accent: "#615CED",
  },
  {
    name: "智谱清言",
    url: "https://chatglm.cn",
    category: "chat",
    desc: {
      zh: "清华系智谱 AI 的 GLM 大模型，擅长中文推理。",
      en: "Tsinghua-backed Zhipu's GLM model strong at Chinese reasoning.",
    },
    region: "domestic",
    accent: "#4F46E5",
  },
  {
    name: "讯飞星火",
    url: "https://xinghuo.xfyun.cn",
    category: "chat",
    desc: {
      zh: "科大讯飞推出的认知大模型，语音能力突出。",
      en: "iFlytek's cognitive model with standout speech capabilities.",
    },
    region: "domestic",
    accent: "#1F5EFF",
  },
  {
    name: "百川智能",
    url: "https://www.baichuan-ai.com",
    category: "chat",
    desc: {
      zh: "王小川创立的大模型公司，覆盖通用与行业场景。",
      en: "Founded by Wang Xiaochuan, spanning general and industry use.",
    },
    region: "domestic",
    accent: "#3B5BFF",
  },
  {
    name: "腾讯混元",
    url: "https://hunyuan.tencent.com",
    category: "chat",
    desc: {
      zh: "腾讯自研大模型，深度接入微信与腾讯生态。",
      en: "Tencent's in-house model wired into WeChat and its ecosystem.",
    },
    region: "domestic",
    accent: "#0052D9",
  },
  {
    name: "阶跃星辰",
    url: "https://www.stepfun.com",
    category: "chat",
    desc: {
      zh: "专注 AGI 的创业公司，多模态模型迭代迅速。",
      en: "An AGI-focused startup with fast-iterating multimodal models.",
    },
    region: "domestic",
    accent: "#2B2B2B",
  },
  {
    name: "天工",
    url: "https://www.tiangong.cn",
    category: "chat",
    desc: {
      zh: "昆仑万维推出的 AI 助手，支持搜索与创作一体。",
      en: "Kunlun's assistant blending search and content creation.",
    },
    region: "domestic",
    accent: "#FF6A00",
  },
  {
    name: "海螺AI",
    url: "https://hailuoai.com",
    category: "chat",
    desc: {
      zh: "MiniMax 出品的助手，语音与视频生成表现亮眼。",
      en: "MiniMax's assistant with impressive voice and video generation.",
    },
    region: "domestic",
    accent: "#6D28D9",
  },
  {
    name: "秘塔AI搜索",
    url: "https://metaso.cn",
    category: "search",
    desc: {
      zh: "无广告的 AI 搜索，答案结构化并附引用。",
      en: "An ad-free AI search that returns structured, cited answers.",
    },
    region: "domestic",
    accent: "#2F54EB",
  },
  {
    name: "通义灵码",
    url: "https://tongyi.aliyun.com/lingma",
    category: "dev",
    desc: {
      zh: "阿里云的 AI 编程助手，支持整库理解与智能生成。",
      en: "Alibaba Cloud's AI coding assistant with repo-wide understanding.",
    },
    region: "domestic",
    accent: "#615CED",
  },
  {
    name: "百度 Comate",
    url: "https://comate.baidu.com",
    category: "dev",
    desc: {
      zh: "百度推出的智能编码助手，覆盖补全、生成与代码问答。",
      en: "Baidu's coding assistant for completion, generation and code Q&A.",
    },
    region: "domestic",
    accent: "#2932E1",
  },
  {
    name: "智谱 AutoGLM",
    url: "https://chatglm.cn",
    category: "agent",
    desc: {
      zh: "智谱推出的自主 Agent，可操控手机/浏览器完成多步任务。",
      en: "Zhipu's autonomous agent that operates phones and browsers to finish multi-step tasks.",
    },
    region: "domestic",
    accent: "#4F46E5",
  },
  {
    name: "Coze（扣子）",
    url: "https://www.coze.cn",
    category: "agent",
    desc: {
      zh: "字节的 Agent 搭建平台，可视化编排并一键发布到多渠道。",
      en: "ByteDance's agent builder with visual orchestration and one-click multi-channel publishing.",
    },
    region: "domestic",
    accent: "#7B61FF",
  },
  {
    name: "Manus",
    url: "https://manus.im",
    category: "agent",
    desc: {
      zh: "通用自主 Agent，能自主拆解并执行研究、分析与办公任务。",
      en: "A general autonomous agent that plans and runs research, analysis and office tasks.",
    },
    region: "domestic",
    accent: "#111827",
  },
  {
    name: "通义万相",
    url: "https://tongyi.aliyun.com/wanxiang",
    category: "image",
    desc: {
      zh: "阿里的文生图模型，擅长国风与商用设计素材。",
      en: "Alibaba's text-to-image model strong at Chinese style and design assets.",
    },
    region: "domestic",
    accent: "#615CED",
  },
  {
    name: "文心一格",
    url: "https://yige.baidu.com",
    category: "image",
    desc: {
      zh: "百度推出的 AI 绘画平台，支持多风格艺术出图。",
      en: "Baidu's AI art platform with multiple artistic styles.",
    },
    region: "domestic",
    accent: "#2932E1",
  },
  {
    name: "即梦",
    url: "https://dreamina.capcut.com",
    category: "image",
    desc: {
      zh: "字节旗下的一站式 AI 创作平台，覆盖图生视频。",
      en: "ByteDance's all-in-one AI studio for images and video.",
    },
    region: "domestic",
    accent: "#7B61FF",
  },
  {
    name: "可灵",
    url: "https://klingai.com",
    category: "video",
    desc: {
      zh: "快手推出的高质量文生视频模型，动作更自然。",
      en: "Kuaishou's high-quality text-to-video with lifelike motion.",
    },
    region: "domestic",
    accent: "#FF5000",
  },
];
