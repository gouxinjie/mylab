export interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: "fullstack" | "frontend" | "ai" | "tool" | "opensource";
  categoryLabel: string;
  tags: string[];
  stars: number;
  forks: number;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  companyEn: string;
  role: string;
  roleEn: string;
  period: string;
  description: string;
  descriptionEn: string;
  current?: boolean;
}

// ─── Projects ──────────────────────────────────────

export const projects: Project[] = [
  {
    id: "nextshop",
    title: "NextShop",
    titleEn: "NextShop",
    description: "基于 Next.js 的现代化电商平台",
    descriptionEn: "A modern e-commerce platform built with Next.js",
    category: "fullstack",
    categoryLabel: "全栈",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    stars: 512,
    forks: 128,
    githubUrl: "https://github.com/gouxinjie/nextshop",
    featured: true,
  },
  {
    id: "ai-chat-hub",
    title: "AI Chat Hub",
    titleEn: "AI Chat Hub",
    description: "多模型聚合 AI 对话平台",
    descriptionEn: "Multi-model aggregated AI chat platform",
    category: "ai",
    categoryLabel: "AI",
    tags: ["React", "OpenAI API", "Dify", "RAG", "WebSocket"],
    stars: 368,
    forks: 89,
    githubUrl: "https://github.com/gouxinjie/ai-chat-hub",
    featured: true,
  },
  {
    id: "dashboard-pro",
    title: "DashBoard Pro",
    titleEn: "DashBoard Pro",
    description: "通用后台管理模板 (Next.js 版)",
    descriptionEn: "General admin dashboard template (Next.js)",
    category: "tool",
    categoryLabel: "工具",
    tags: ["Next.js", "Ant Design", "ECharts", "TypeScript"],
    stars: 274,
    forks: 67,
    githubUrl: "https://github.com/gouxinjie/dashboard-pro",
    featured: true,
  },
  {
    id: "use-hooks-plus",
    title: "use-hooks-plus",
    titleEn: "use-hooks-plus",
    description: "一套实用的 React Hooks 集合",
    descriptionEn: "A collection of practical React Hooks",
    category: "opensource",
    categoryLabel: "开源",
    tags: ["React", "TypeScript", "Hooks", "npm"],
    stars: 198,
    forks: 45,
    githubUrl: "https://github.com/gouxinjie/use-hooks-plus",
    featured: true,
  },
];

// ─── Skills ──────────────────────────────────────

export const skills: Skill[] = [
  { name: "TypeScript", icon: "ts" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Tailwind CSS", icon: "tailwind" },
  { name: "Docker", icon: "docker" },
  { name: "AWS", icon: "aws" },
  { name: "Git", icon: "git" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "PostgreSQL", icon: "postgresql" },
];

// ─── AI Tools ────────────────────────────────────

export const aiTools = [
  { name: "OpenAI API", category: "LLM", categoryEn: "LLM" },
  { name: "Dify", category: "平台", categoryEn: "Platform" },
  { name: "LangChain", category: "框架", categoryEn: "Framework" },
  { name: "Coze", category: "平台", categoryEn: "Platform" },
  { name: "RAG", category: "技术", categoryEn: "Technique" },
  { name: "向量数据库", category: "数据库", categoryEn: "Database" },
  { name: "Agent", category: "架构", categoryEn: "Architecture" },
  { name: "Prompt Engineering", category: "技术", categoryEn: "Technique" },
];

// ─── Experience ───────────────────────────────────

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "当前公司",
    companyEn: "Current Company",
    role: "全栈开发工程师 / AI 工程师",
    roleEn: "Full Stack Developer & AI Engineer",
    period: "2023 - 至今",
    description: "负责公司核心产品的前后端开发，主导 AI 能力的接入与落地。",
    descriptionEn: "Responsible for full-stack development of core products, leading AI integration.",
    current: true,
  },
  // Add more as needed
];

// ─── GitHub Stats ───────────────────────────────

export const githubStats = {
  username: "gouxinjie",
  repos: 30,
  stars: 1200,
  commits: 1300,
  followers: null, // fetched from API
};

// ─── Social Links ───────────────────────────────

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/gouxinjie",
    icon: "github",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/gouxinjie",
    icon: "twitter",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/gouxinjie",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:gouxinjie@example.com",
    icon: "email",
  },
];
