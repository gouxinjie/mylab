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

// ─── 项目 ──────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "next-dashboard",
    title: "Next Dashboard",
    titleEn: "Next Dashboard",
    description: "基于 Next.js 的现代化后台管理模板，简洁敏捷，开箱即用。",
    descriptionEn: "A modern admin dashboard template based on Next.js, clean and ready to use.",
    category: "tool",
    categoryLabel: "工具",
    tags: ["Next.js", "TypeScript", "SCSS"],
    stars: 512,
    forks: 128,
    githubUrl: "https://github.com/gouxinjie/next-dashboard",
    featured: true,
  },
  {
    id: "memo-hub",
    title: "Memo Hub",
    titleEn: "Memo Hub",
    description: "一款简洁的笔记应用，支持 Markdown、标签管理与多端同步。",
    descriptionEn: "A simple note-taking app with Markdown support, tag management, and multi-device sync.",
    category: "fullstack",
    categoryLabel: "全栈",
    tags: ["React", "Node.js", "MongoDB"],
    stars: 368,
    forks: 89,
    githubUrl: "https://github.com/gouxinjie/memo-hub",
    featured: true,
  },
  {
    id: "image-toolkit",
    title: "Image Toolkit",
    titleEn: "Image Toolkit",
    description: "在线图片处理工具，支持压缩、格式转换、裁剪等常用功能。",
    descriptionEn: "Online image processing tool, supporting compression, format conversion, cropping, etc.",
    category: "tool",
    categoryLabel: "工具",
    tags: ["Vue 3", "Vite", "TypeScript"],
    stars: 274,
    forks: 67,
    githubUrl: "https://github.com/gouxinjie/image-toolkit",
    featured: true,
  },
];

// ─── 技术栈 ────────────────────────────────────────

export const skills: Skill[] = [
  { name: "TypeScript", icon: "ts" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Node.js", icon: "nodejs" },
  { name: "SCSS", icon: "scss" },
  { name: "Docker", icon: "docker" },
  { name: "AWS", icon: "aws" },
  { name: "Git", icon: "git" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "PostgreSQL", icon: "postgresql" },
];

// ─── AI 工具 ──────────────────────────────────────

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

// ─── 工作经历 ──────────────────────────────────────

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
  // 可按需补充更多
];

// ─── GitHub 数据 ──────────────────────────────────

export const githubStats = {
  username: "gouxinjie",
  repos: 30,
  stars: 1200,
  commits: 1300,
  followers: null, // 从 API 获取
};

// ─── 社交链接 ──────────────────────────────────────

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
