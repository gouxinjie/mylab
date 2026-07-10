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
