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
  tags: string[];
  icon: string;
  current?: boolean;
}

export interface Value {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
}

// ─── 技术栈 ────────────────────────────────────────

export const skills: Skill[] = [
  { name: "TypeScript", icon: "ts" },
  { name: "JavaScript", icon: "js" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Vue.js", icon: "vue" },
  { name: "Go", icon: "go" },
  { name: "Tailwind CSS", icon: "tailwind" },
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
    company: "某科技公司",
    companyEn: "Tech Company",
    role: "高级全栈开发工程师",
    roleEn: "Senior Full Stack Developer",
    period: "2022.06 - 至今",
    description: "负责核心产品的设计与开发，带领团队构建高性能、可扩展的 Web 应用和服务。",
    descriptionEn: "Responsible for core product design and development, leading the team to build high-performance, scalable Web applications and services.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    icon: "building",
    current: true,
  },
  {
    id: "exp-2",
    company: "某互联网公司",
    companyEn: "Internet Company",
    role: "前端开发工程师",
    roleEn: "Frontend Developer",
    period: "2019.03 - 2022.05",
    description: "参与多个业务系统的前端开发，优化用户体验，提升系统性能与可维护性。",
    descriptionEn: "Participated in frontend development of multiple business systems, optimized user experience, improved system performance and maintainability.",
    tags: ["Vue.js", "JavaScript", "Element UI", "Node.js"],
    icon: "laptop",
  },
  {
    id: "exp-3",
    company: "某创业团队",
    companyEn: "Startup Team",
    role: "前端开发实习生",
    roleEn: "Frontend Intern",
    period: "2017.07 - 2019.02",
    description: "负责产品前端页面开发与维护，参与需求讨论与技术选型。",
    descriptionEn: "Responsible for frontend page development and maintenance, participated in requirement discussions and technology selection.",
    tags: ["HTML", "CSS", "JavaScript", "jQuery"],
    icon: "rocket",
  },
];

// ─── 价值观 ────────────────────────────────────────

export const values: Value[] = [
  {
    id: "value-1",
    title: "持续学习",
    titleEn: "Continuous Learning",
    description: "保持对新技术的好奇心，不断学习和实践。",
    descriptionEn: "Maintain curiosity about new technologies, keep learning and practicing.",
    icon: "book-open",
  },
  {
    id: "value-2",
    title: "代码质量",
    titleEn: "Code Quality",
    description: "追求简洁、可维护和高质量的代码设计。",
    descriptionEn: "Pursue clean, maintainable and high-quality code design.",
    icon: "code-2",
  },
  {
    id: "value-3",
    title: "用户体验",
    titleEn: "User Experience",
    description: "关注细节，打造直观、流畅的用户体验。",
    descriptionEn: "Pay attention to details, create intuitive and smooth user experiences.",
    icon: "users",
  },
  {
    id: "value-4",
    title: "解决问题",
    titleEn: "Problem Solving",
    description: "擅长分析和解决复杂问题，创造实际价值。",
    descriptionEn: "Good at analyzing and solving complex problems, creating real value.",
    icon: "lightbulb",
  },
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
