/**
 * @file data.ts
 * @description 全局共享数据：技能、经历、统计、技术栈等类型定义与数据集
 * @author gouxinjie
 */

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

// 数据概览（关于页 Quick Stats）
export interface AboutStat {
  icon: string;
  value: string;
  label: string;
  labelEn: string;
  /** 主题色：用于图标背景、数值、底部短线 */
  color: string;
  /** 浅色背景色：用于图标圆形底色 */
  bgColor: string;
}

// 技术清单徽章
export interface TechBadge {
  label: string;
  img: string;
}

// 技术清单分组
export interface TechCategory {
  title: string;
  titleEn: string;
  badges: TechBadge[];
}

// ─── 工作经历 ──────────────────────────────────────

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "上海云济信息科技有限公司",
    companyEn: "Shanghai Yunji Information Technology Co., Ltd.",
    role: "高级前端工程师",
    roleEn: "Senior Frontend Engineer",
    period: "2025.02 - 至今",
    description: "负责复星集团本部的前端日常开发工作，深入对接钉钉微应用建设，同时参与银行服务器运维与跨团队资源整合；优化老项目打包构建与工程提效，将 AI 工具融入研发流程；使用 AI 表格进行项目的规整与记录。",
    descriptionEn: "Responsible for daily frontend development at Fosun Group HQ, working closely on DingTalk micro-app development, while participating in bank server operations and cross-team resource integration; optimized legacy project build and engineering efficiency by embedding AI tools into the R&D workflow, and used AI spreadsheets to organize and track projects.",
    tags: ["React", "TypeScript", "Next.js", "钉钉微应用", "构建优化", "AI 工具"],
    icon: "building",
    current: true,
  },
  {
    id: "exp-2",
    company: "上海盛硅科技发展有限公司",
    companyEn: "Shanghai Shenggui Technology Development Co., Ltd.",
    role: "中级前端工程师",
    roleEn: "Mid-level Frontend Engineer",
    period: "2023.06 - 2024.12",
    description: "独立负责多端小程序及大规模中后台系统 from 0 to 1 的全链路开发，参与核心业务建模与技术评审。沉淀可复用的组件库与技术方案，通过工程化手段提升团队研发效能 30%+。保障项目高质量交付。",
    descriptionEn: "Independently owned end-to-end development of multi-end mini-programs and large-scale middle/back-office systems from 0 to 1, participating in core business modeling and technical reviews. Built reusable component libraries and technical solutions, improving team R&D efficiency by 30%+ through engineering practices. Ensured high-quality delivery of projects.",
    tags: ["Vue.js", "微信小程序", "Uni-app", "Nuxt"],
    icon: "laptop",
  },
  {
    id: "exp-3",
    company: "上海奥诃信息技术有限公司",
    companyEn: "Shanghai Aohe Information Technology Co., Ltd.",
    role: "初级前端工程师",
    roleEn: "Junior Frontend Engineer",
    period: "2020.07 - 2023.05",
    description: "专注于高质量 UI 还原与复杂业务交互实现，在快速迭代的实战中沉淀了深厚的原生 JavaScript 与 CSS 工程能力。",
    descriptionEn: "Focused on high-fidelity UI implementation and complex interaction, building solid native JavaScript and CSS engineering skills through fast-iteration practice.",
    tags: ["JavaScript", "CSS", "HTML", "UI 还原"],
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

// ─── 数据概览（Quick Stats） ─────────────────────

export const aboutStats: AboutStat[] = [
  { icon: "💼", value: "6+", label: "工作年限", labelEn: "Years of Experience", color: "#00C853", bgColor: "rgba(0, 200, 83, 0.08)" },
  { icon: "⚡", value: "50+", label: "技术沉淀", labelEn: "Tech Skills", color: "#FF9800", bgColor: "rgba(255, 152, 0, 0.08)" },
  { icon: "📝", value: "300+", label: "发布文章", labelEn: "Articles Published", color: "#7C4DFF", bgColor: "rgba(124, 77, 255, 0.08)" },
  { icon: "📦", value: "20+", label: "开源项目", labelEn: "Open Source Projects", color: "#2196F3", bgColor: "rgba(33, 150, 243, 0.08)" },
  { icon: "🚀", value: "+∞", label: "学习热情", labelEn: "Learning Enthusiasm", color: "#F50057", bgColor: "rgba(245, 0, 87, 0.08)" },
];

// ─── 技术清单（徽章分组） ───────────────────────

export const techCategories: TechCategory[] = [
  {
    title: "前端技术栈",
    titleEn: "Frontend",
    badges: [
      { label: "JavaScript", img: "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" },
      { label: "HTML5", img: "https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" },
      { label: "CSS3", img: "https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" },
      { label: "TypeScript", img: "https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" },
      { label: "Vue.js", img: "https://img.shields.io/badge/Vue.js-4FC08D?logo=Vue.js&logoColor=fff" },
      { label: "Vue 3", img: "https://img.shields.io/badge/Vue.js%203-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" },
      { label: "React", img: "https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=333" },
      { label: "Next.js", img: "https://img.shields.io/badge/Next.js-000000?logo=Next.js&logoColor=fff" },
      { label: "Angular", img: "https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white" },
      { label: "Axios", img: "https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" },
      { label: "Lodash", img: "https://img.shields.io/badge/Lodash-3498db?logo=Lodash&logoColor=fff" },
      { label: "Swiper", img: "https://img.shields.io/badge/Swiper-6332F6?logo=Swiper&logoColor=fff" },
      { label: "uni-app", img: "https://img.shields.io/badge/uni--app-337EFF?style=flat-square&logo=uniapp&logoColor=white" },
      { label: "微信小程序", img: "https://img.shields.io/badge/微信小程序-07C160?style=flat-square&logo=wechat&logoColor=white" },
      { label: "支付宝小程序", img: "https://img.shields.io/badge/支付宝小程序-1677FF?style=flat-square&logo=alipay&logoColor=white" },
      { label: "VitePress", img: "https://img.shields.io/badge/VitePress-646CFF?style=flat-square&logo=vitepress&logoColor=white" },
      { label: "Zustand", img: "https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=redux&logoColor=white" },
      { label: "Pinia", img: "https://img.shields.io/badge/Pinia-FFD859?style=flat-square&logo=pinia&logoColor=000" },
      { label: "Vant", img: "https://img.shields.io/badge/Vant-1989FA?style=flat-square&logo=vant&logoColor=white" },
      { label: "Element Plus", img: "https://img.shields.io/badge/Element--Plus-409EFF?style=flat-square&logo=elementplus&logoColor=white" },
      { label: "Ant Design", img: "https://img.shields.io/badge/Ant_Design-1677FF?logo=AntDesign&logoColor=fff" },
      { label: "Bootstrap", img: "https://img.shields.io/badge/-Bootstrap-7952B3?logo=Bootstrap&logoColor=FFF" },
      { label: "ECharts", img: "https://img.shields.io/badge/ECharts-AA344D?style=flat-square&logo=apacheecharts&logoColor=white" },
      { label: "Tailwind CSS", img: "https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=TailwindCSS&logoColor=fff" },
      { label: "Sass", img: "https://img.shields.io/badge/Sass-CC6699?logo=Sass&logoColor=fff" },
      { label: "Less", img: "https://img.shields.io/badge/Less-1D365D?logo=Less&logoColor=fff" },
    ],
  },
  {
    title: "后端技术栈",
    titleEn: "Backend",
    badges: [
      { label: "Node.js", img: "https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" },
      { label: "Express", img: "https://img.shields.io/badge/Express-000000?logo=Express&logoColor=fff" },
      { label: "Python", img: "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" },
      { label: "MySQL", img: "https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" },
    ],
  },
  {
    title: "构建与工程化",
    titleEn: "Build & Engineering",
    badges: [
      { label: "WebPack", img: "https://img.shields.io/badge/WebPack-8DD6F9?logo=WebPack&logoColor=333" },
      { label: "Rollup", img: "https://img.shields.io/badge/Rollup-EC4A3F?logo=Rollup.js&logoColor=fff" },
      { label: "Vite", img: "https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=fff" },
      { label: "Turbopack", img: "https://img.shields.io/badge/Turbopack-EF2D5E?style=flat-square&logo=turbopack&logoColor=white" },
      { label: "Rsbuild", img: "https://img.shields.io/badge/Rsbuild-F0B62E?style=flat-square&logo=rsbuild&logoColor=black" },
      { label: "CI/CD", img: "https://img.shields.io/badge/CI/CD-6C63FF?style=flat-square&logo=githubactions&logoColor=white" },
      { label: "npm", img: "https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" },
      { label: "pnpm", img: "https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" },
      { label: "Yarn", img: "https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=white" },
      { label: "nvm", img: "https://img.shields.io/badge/nvm-35495E?logo=nodedotjs&logoColor=white" },
      { label: "ESLint", img: "https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" },
      { label: "Prettier", img: "https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black" },
    ],
  },
  {
    title: "代码与调试",
    titleEn: "Code & Debug",
    badges: [
      { label: "Git", img: "https://img.shields.io/badge/-Git-F05032?logo=Git&logoColor=FFF" },
      { label: "GitHub", img: "https://img.shields.io/badge/-GitHub-181717?logo=GitHub&logoColor=FFF" },
      { label: "Gitee", img: "https://img.shields.io/badge/-Gitee-C71D23?logo=Gitee&logoColor=FFF" },
      { label: "GitLab", img: "https://img.shields.io/badge/-GitLab-FC6D26?logo=GitLab&logoColor=FFF" },
      { label: "GitHub Pages", img: "https://img.shields.io/badge/-GitHub%20Pages-222?logo=GitHub-Pages&logoColor=FFF" },
      { label: "GitHub Actions", img: "https://img.shields.io/badge/-GitHub%20Actions-2088FF?logo=GitHub-Actions&logoColor=FFF" },
      { label: "Apifox", img: "https://img.shields.io/badge/Apifox-F64952?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00em0wIDJhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00em0wIDJhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00em0wIDJhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00em0wIDJhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00eiIvPjwvc3ZnPg==&logoColor=white" },
      { label: "ApiPost", img: "https://img.shields.io/badge/ApiPost-FF6A33?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01em0wIDdMNyAxM2w1LTIuNUwxNyAxM2wtNSAyLjV6bTAgNmwtMTAtNSAxMC01IDEwIDUtMTAtNXoiLz48L3N2Zz4=&logoColor=white" },
      { label: "Postman", img: "https://img.shields.io/badge/-Postman-FF6C37?logo=Postman&logoColor=FFF" },
    ],
  },
  {
    title: "运维与部署",
    titleEn: "Ops & Deploy",
    badges: [
      { label: "CI/CD", img: "https://img.shields.io/badge/CI/CD-6C63FF?style=flat-square&logo=githubactions&logoColor=white" },
      { label: "Jenkins", img: "https://img.shields.io/badge/-Jenkins-D24939?logo=Jenkins&logoColor=000" },
      { label: "Docker", img: "https://img.shields.io/badge/-Docker-2496ED?logo=Docker&logoColor=FFF" },
      { label: "Kubernetes", img: "https://img.shields.io/badge/-Kubernetes-326CE5?logo=Kubernetes&logoColor=FFF" },
      { label: "Vercel", img: "https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" },
      { label: "Nginx", img: "https://img.shields.io/badge/-Nginx-009639?logo=Nginx&logoColor=FFF" },
      { label: "VMware", img: "https://img.shields.io/badge/-VMware-607078?logo=VMware&logoColor=FFF" },
      { label: "CentOS", img: "https://img.shields.io/badge/-CentOS-262577?logo=CentOS&logoColor=FFF" },
      { label: "Ubuntu", img: "https://img.shields.io/badge/-Ubuntu-E95420?logo=Ubuntu&logoColor=FFF" },
    ],
  },
  {
    title: "编辑器与协作平台",
    titleEn: "Editors & Collab",
    badges: [
      { label: "Markdown", img: "https://img.shields.io/badge/-Markdown-000?logo=Markdown&logoColor=FFF" },
      { label: "VS Code", img: "https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" },
      { label: "Trae", img: "https://img.shields.io/badge/Trae-000000?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=&logoColor=white" },
      { label: "Cursor", img: "https://img.shields.io/badge/Cursor-000000?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMgM2gydjE4SDN6bTQgMGgxNHYxOEg3eiIvPjwvc3ZnPg==&logoColor=white" },
      { label: "阿里云云效", img: "https://img.shields.io/badge/阿里云云效-1A6CFF?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik01MTIgNjRDMjY0LjYgNjQgNjQgMjY0LjYgNjQgNTEyczIwMC42IDQ0OCA0NDggNDQ4IDQ0OC0yMDAuNiA0NDgtNDQ4Uzc1OS40IDY0IDUxMiA2NHptMjU2IDU3Nkg1MTJWMzA0aDI1NnYzMzZ6TTUxMiA1NzZWMzA0SDI1NnYyNzJoMjU2eiIvPjwvZz48L3N2Zz4=&logoColor=white" },
      { label: "语雀", img: "https://img.shields.io/badge/语雀-25B864?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIwLjUgMTJhOC41IDguNSAwIDAgMC04LjUtOC41QTguNSA4LjUgMCAwIDAgMy41IDEyYTguNSA4LjUgMCAwIDAgOC41IDguNWE4LjUgOC41IDAgMCAwIDguNS04LjV6bS0xMiAwYTMuNSAzLjUgMCAxIDEgMy41IDMuNUExMy45NSAxMy45NSAwIDAgMSAxMiAxM2EzLjUgMy41IDAgMCAxLTMuNS0zLjV6Ii8+PC9zdmc+&logoColor=white" },
      { label: "蓝湖", img: "https://img.shields.io/badge/蓝湖-00A1E9?style=flat-square" },
      { label: "Iconfont", img: "https://img.shields.io/badge/Iconfont-FF6A00?style=flat-square" },
    ],
  },
  {
    title: "常用 AI 平台",
    titleEn: "AI Platforms",
    badges: [
      { label: "OpenAI (ChatGPT)", img: "https://img.shields.io/badge/OpenAI%20(ChatGPT)-412991?style=flat-square&logo=openai&logoColor=white" },
      { label: "Microsoft Copilot", img: "https://img.shields.io/badge/Microsoft%20Copilot-0078D4?style=flat-square" },
      { label: "Google Gemini", img: "https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" },
      { label: "Grok (xAI)", img: "https://img.shields.io/badge/Grok%20(xAI)-000000?style=flat-square" },
      { label: "DeepSeek", img: "https://img.shields.io/badge/DeepSeek-24292E?style=flat-square" },
      { label: "Kimi Chat", img: "https://img.shields.io/badge/Kimi%20Chat-161823?style=flat-square" },
      { label: "文心一言 (ERNIE)", img: "https://img.shields.io/badge/文心一言%20(ERNIE)-2932E1?style=flat-square" },
      { label: "通义千问", img: "https://img.shields.io/badge/通义千问-00A1E9?style=flat-square" },
    ],
  },
];


