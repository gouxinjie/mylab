/**
 * @file 项目数据集（类型定义与全量项目数据）
 * @description 定义 Project 相关类型，并维护所有项目的展示/筛选/运维数据；文本字段采用中英双语结构
 * @author gouxinjie
 */

/**
 * 多语言文本（中文 + 英文）
 */
export interface LocalizedText {
  /** 中文文案 */
  zh: string;
  /** 英文文案 */
  en: string;
}

/**
 * 构建多语言文本对象的简写辅助函数
 * @param zh - 中文文案
 * @param en - 英文文案
 * @returns 多语言文本对象
 */
const L = (zh: string, en: string): LocalizedText => ({ zh, en });

/**
 * 单个技术栈条目的类型
 */
export interface TechItem {
  /** 技术分类（中文 + 英文） */
  category: LocalizedText;
  /** 具体技术描述（中文 + 英文） */
  tech: LocalizedText;
}

/**
 * 项目状态（可根据实际情况扩展）
 */
export type ProjectStatus = '正常运行' | '开发中' | '未发布';

/**
 * 项目分类（用于展示与筛选，可按实际业务扩展）
 */
export type ProjectCategory = '平台' | '应用' | '工具' | '数据可视化' | '其他' | '学习研究';

/**
 * 完整项目信息
 */
export interface Project {
  /** 项目唯一标识（通常为简短名称） */
  id: string;
  /** 项目标题（显示名称，通常为专有名词，不翻译） */
  title: string;
  /** 项目简述（一句话概括，双语） */
  brief: LocalizedText;
  /** 项目详细描述（双语） */
  description: LocalizedText;
  /** 项目仓库地址，若无则 null */
  repoUrl: string | null;
  /** 服务器部署路径（技术信息，不翻译） */
  deployPath: string;
  /** 启动方式与部署流程说明（双语） */
  startMode: LocalizedText;
  /** 当前运行状态（枚举键，用于筛选与状态样式，不翻译） */
  status: ProjectStatus;
  /** 项目分类（枚举键，用于筛选与分类标签，双语展示通过 categoryLabel 提供） */
  category: LocalizedText;
  /** 项目标签（比分类更细的展示与筛选维度，技术名词不翻译） */
  tags: string[];
  /** 是否精选（用于首页/精选专区优先展示） */
  featured: boolean;
  /** 排序权重（数值越小越靠前） */
  order: number;
  /** 补充备注（如 CI/CD 细节，双语） */
  remark: LocalizedText;
  /** 端口信息（内外部监听情况，技术信息不翻译） */
  port: string;
  /** 公网访问 URL，若无则 null */
  url: string | null;
  /** 项目封面/轮播图列表（字符串数组，第一张为封面，用于轮播展示） */
  covers: string[];
  /** 技术栈简述（一句话概括，用顿号分隔，双语） */
  techStackBrief: LocalizedText;
  /** 详细技术栈列表（分类 + 技术，双语） */
  techStackDetail: TechItem[];
}

/**
 * 所有项目的数组（可直接用于展示或数据处理）
 */
export const projects: Project[] = [
  {
    id: 'mylab',
    title: 'mylab',
    category: L('平台', 'Platform'),
    tags: ['Next.js', 'React 18', 'TypeScript', 'SCSS', 'next-intl', 'Docker'],
    featured: true,
    order: 0,
    brief: L('个人技术与项目展示网站', 'Personal Tech & Projects Showcase'),
    description: L(
      '一个集中展示与归档我维护的各类 Web 应用、平台与工具的个人作品集站点，支持中英文双语浏览。首页呈现精选作品与动态视觉，项目列表可按分类 / 标签筛选，详情页轮播展示封面与技术栈；内置 AI 笔记（Markdown 文档渲染、Mermaid 图表）、AI 产品导航与 GitHub 数据看板，整体以 SCSS + CSS 变量实现双主题。',
      'A personal portfolio site that centrally showcases and archives the various web apps, platforms, and tools I maintain, with bilingual (Chinese/English) browsing. The homepage presents featured works with dynamic visuals; the projects list can be filtered by category/tags, and the detail page carousels covers and tech stacks. It includes AI Notes (Markdown rendering, Mermaid diagrams), an AI product navigator, and a GitHub data dashboard, with a dual theme implemented via SCSS + CSS variables.'
    ),
    repoUrl: 'https://github.com/gouxinjie/mylab',
    deployPath: '/var/www/mylab',
    startMode: L(
      'Docker Compose 编排（Next.js standalone 镜像 + Nginx 反代），GitHub Actions 构建镜像推送到 ghcr.io 后由 ECS 拉取运行',
      'Orchestrated with Docker Compose (Next.js standalone image + Nginx reverse proxy). GitHub Actions builds the image and pushes it to ghcr.io, then ECS pulls and runs it.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 → 类型校验 → 构建 standalone 镜像 → 推送 ghcr.io → SSH 解压发布包 → Docker Compose pull + up -d（滚动替换）',
      'Automated deployment via GitHub Actions: push to main triggers type checking -> build standalone image -> push to ghcr.io -> SSH extract release package -> Docker Compose pull + up -d (rolling replacement).'
    ),
    port: 'Next.js standalone 监听 3500，容器 Nginx 反代对外 3500，宿主机 Nginx 转发 80 → 127.0.0.1:3500',
    url: 'https://www.gouxinjie.com',
    covers: ['/images/project-cover/mylab.png', '/images/project-cover/mylab-1.png', '/images/project-cover/mylab-2.png'],
    techStackBrief: L(
      'Next.js 14、React 18、TypeScript、SCSS、next-intl 国际化、React Markdown、Mermaid、Docker Compose 部署',
      'Next.js 14, React 18, TypeScript, SCSS, next-intl i18n, React Markdown, Mermaid, Docker Compose deployment'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('Next.js 14（App Router）+ React 18 + TypeScript', 'Next.js 14 (App Router) + React 18 + TypeScript') },
      { category: L('样式', 'Styling'), tech: L('SCSS（变量、Mixin、BEM 语义化命名）+ CSS 变量双主题', 'SCSS (variables, mixins, BEM semantic naming) + CSS variables dual theme') },
      { category: L('国际化', 'i18n'), tech: L('next-intl（zh / en 多语言路由，中间件语言检测）', 'next-intl (zh / en multilingual routing, middleware language detection)') },
      { category: L('Markdown 渲染', 'Markdown'), tech: L('react-markdown + remark-gfm + rehype-highlight + rehype-slug + github-slugger', 'react-markdown + remark-gfm + rehype-highlight + rehype-slug + github-slugger') },
      { category: L('图表', 'Charts'), tech: L('Mermaid 11（AI 笔记流程图 / 架构图）', 'Mermaid 11 (AI notes flowcharts / architecture diagrams)') },
      { category: L('图标', 'Icons'), tech: L('lucide-react（optimizePackageImports 按需导入）', 'lucide-react (optimizePackageImports on-demand import)') },
      { category: L('字体', 'Fonts'), tech: L('@fontsource/noto-sans-sc（思源黑体）', '@fontsource/noto-sans-sc (Source Han Sans)') },
      { category: L('内容管理', 'Content'), tech: L('文件系统 Markdown（content/ai/*.md 运行时读取，lib/ai-docs.ts 解析）', 'Filesystem Markdown (content/ai/*.md read at runtime, parsed by lib/ai-docs.ts)') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint + eslint-config-next', 'ESLint + eslint-config-next') },
      { category: L('包管理', 'Package Manager'), tech: L('pnpm', 'pnpm') },
      { category: L('构建', 'Build'), tech: L('Next.js standalone 输出（多阶段 Docker 镜像精简体积）', 'Next.js standalone output (multi-stage Docker image for smaller size)') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（构建镜像 → 推送 ghcr.io → SSH 远程部署）', 'GitHub Actions (build image -> push to ghcr.io -> SSH remote deploy)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS + Docker Compose（Next.js 应用 + Nginx 反代）', 'Alibaba Cloud ECS + Docker Compose (Next.js app + Nginx reverse proxy)') }
    ]
  },
  {
    id: 'blog',
    title: 'blog',
    category: L('学习研究', 'Learning'),
    tags: ['VitePress', 'Vue 3', 'TypeScript'],
    featured: true,
    order: 1,
    brief: L('我的技术博客系统', 'My Tech Blog System'),
    description: L(
      '从前端基础到框架实战，从编码提效到工程化部署，记录每个真实项目的踩坑、决策和复盘——不追热点，写自己验证过的东西',
      'From frontend fundamentals to framework practice, from coding efficiency to engineering deployment, documenting the pitfalls, decisions, and retrospectives of every real project. No hype-chasing, only writing about things I have personally verified.'
    ),
    repoUrl: 'https://github.com/gouxinjie/gouxinjie.github.io',
    deployPath: '/var/www/blog',
    startMode: L(
      'Nginx 直接托管静态文件，GitHub Actions 构建后 SCP 上传到 ECS',
      'Nginx serves static files directly; GitHub Actions builds, then SCP uploads to ECS.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 vitepress build → SCP 上传 dist → ECS Nginx reload',
      'Automated deployment via GitHub Actions: push to main triggers vitepress build -> SCP upload dist -> ECS Nginx reload.'
    ),
    port: '直接监听的本地80端口',
    url: 'http://blog.gouxinjie.com/',
    covers: ['/images/project-cover/blog.png', '/images/project-cover/blog-1.png', '/images/project-cover/blog-2.png'],
    techStackBrief: L(
      'VitePress、Vue 3、TypeScript、Sass、TailwindCSS、Algolia 搜索',
      'VitePress, Vue 3, TypeScript, Sass, TailwindCSS, Algolia Search'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('VitePress + Vue 3 + TypeScript', 'VitePress + Vue 3 + TypeScript') },
      { category: L('样式', 'Styling'), tech: L('Sass + TailwindCSS，Google Fonts (Inter / JetBrains Mono)', 'Sass + TailwindCSS, Google Fonts (Inter / JetBrains Mono)') },
      { category: L('搜索', 'Search'), tech: L('Algolia DocSearch', 'Algolia DocSearch') },
      { category: L('图表', 'Charts'), tech: L('Mermaid (vitepress-plugin-mermaid)', 'Mermaid (vitepress-plugin-mermaid)') },
      { category: L('交互', 'Interaction'), tech: L('medium-zoom 图片预览、NProgress 进度条、canvas-confetti 特效', 'medium-zoom image preview, NProgress progress bar, canvas-confetti effects') },
      { category: L('统计', 'Analytics'), tech: L('Busuanzi 访问量', 'Busuanzi page views') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint + Prettier + vue-tsc', 'ESLint + Prettier + vue-tsc') },
      { category: L('包管理', 'Package Manager'), tech: L('pnpm', 'pnpm') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（ECS 自动部署 + GitHub Pages）', 'GitHub Actions (ECS auto-deploy + GitHub Pages)') },
      { category: L('部署', 'Deployment'), tech: L('GitHub Pages / Vercel / 阿里云 ECS / Gitee Pages', 'GitHub Pages / Vercel / Alibaba Cloud ECS / Gitee Pages') }
    ]
  },
  {
    id: 'prompt',
    title: 'Prompt Gallery',
    category: L('平台', 'Platform'),
    tags: ['Next.js', 'React 19', 'Supabase'],
    featured: true,
    order: 2,
    brief: L('Image2图片提示词案例平台', 'Image2 Prompt Case Library Platform'),
    description: L(
      '一个支持管理、展示和投稿 AI 图片生成提示词的完整平台。用户可以按分类/风格/场景筛选浏览案例库、收藏案例、一键复制提示词和下载图片；管理员可发布案例、审核投稿、维护标签体系和查看数据统计——从展示到管理，功能闭环完整。',
      'A complete platform for managing, showcasing, and submitting AI image-generation prompts. Users can filter and browse the library by category/style/scenario, favorite cases, one-click copy prompts, and download images; admins can publish cases, review submissions, maintain the tag system, and view statistics, a full loop from display to management.'
    ),
    repoUrl: 'https://github.com/gouxinjie/prompt-template-studio',
    deployPath: '/var/www/prompt',
    startMode: L(
      'Next.js standalone server 由 PM2 管理，Nginx 反向代理到 `127.0.0.1:5174`，GitHub Actions 构建后 rsync 上传到 ECS',
      'Next.js standalone server managed by PM2, Nginx reverse-proxied to `127.0.0.1:5174`; GitHub Actions builds then rsync uploads to ECS.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 `npm run build` → 生成 standalone 运行产物 → rsync 上传 deploy-artifact 到 ECS → PM2 重载 Node 服务 → Nginx reload',
      'Automated deployment via GitHub Actions: push to main triggers `npm run build` -> generate standalone artifact -> rsync upload deploy-artifact to ECS -> PM2 reload Node service -> Nginx reload.'
    ),
    port: 'Nginx 监听 8080 端口反代到 5174（PM2 管理 Node 进程）',
    url: 'http://prompt.gouxinjie.com',
    covers: ['/images/project-cover/prompt.png', '/images/project-cover/prompt-1.png', '/images/project-cover/prompt-2.png', '/images/project-cover/prompt-3.png'],
    techStackBrief: L(
      'Next.js 16、React 19、TypeScript、Supabase、SCSS Modules、Radix UI',
      'Next.js 16, React 19, TypeScript, Supabase, SCSS Modules, Radix UI'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('Next.js + React 19 + TypeScript', 'Next.js + React 19 + TypeScript') },
      { category: L('路由', 'Routing'), tech: L('React Router 7（页面路由）+ Next.js API Route（接口适配）', 'React Router 7 (page routing) + Next.js API Route (API adapter)') },
      { category: L('样式', 'Styling'), tech: L('SCSS Modules + TailwindCSS + CSS Variables（双主题）', 'SCSS Modules + TailwindCSS + CSS Variables (dual theme)') },
      { category: L('后端正交层', 'Backend Layer'), tech: L('Supabase Auth / Postgres / RLS / RPC', 'Supabase Auth / Postgres / RLS / RPC') },
      { category: L('UI 组件', 'UI Components'), tech: L('Radix UI (Dialog / Select / AlertDialog / Slot)', 'Radix UI (Dialog / Select / AlertDialog / Slot)') },
      { category: L('表格', 'Table'), tech: L('TanStack Table', 'TanStack Table') },
      { category: L('图标', 'Icons'), tech: L('Lucide React', 'Lucide React') },
      { category: L('Toast', 'Toast'), tech: L('Sonner', 'Sonner') },
      { category: L('存储', 'Storage'), tech: L('阿里云 OSS 浏览器直传', 'Alibaba Cloud OSS browser direct upload') },
      { category: L('校验', 'Validation'), tech: L('Zod', 'Zod') },
      { category: L('包管理', 'Package Manager'), tech: L('npm', 'npm') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（ECS 自动部署）+ EdgeOne Pages', 'GitHub Actions (ECS auto-deploy) + EdgeOne Pages') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS（PM2 + Nginx 反向代理）、EdgeOne Pages', 'Alibaba Cloud ECS (PM2 + Nginx reverse proxy), EdgeOne Pages') },
      { category: L('数据库', 'Database'), tech: L('Supabase Postgres（16 个迁移文件，含 RLS/RPC/触发器）', 'Supabase Postgres (16 migration files with RLS/RPC/triggers)') }
    ]
  },
  {
    id: 'archive',
    title: 'archive',
    category: L('应用', 'Application'),
    tags: ['Nuxt 4', 'Vue 3', 'SQLite'],
    featured: false,
    order: 3,
    brief: L('个人档案管理系统', 'Personal Archive Management System'),
    description: L(
      '一个本地优先的私人资料管理系统，集中保存和管理账号密码、文档资料、简历文件、图片、证件和学习资料。按用户账号隔离数据，面向个人长期沉淀工作记录、生活资料和数字资产。',
      'A local-first private document management system that centrally stores and manages account passwords, documents, resumes, images, IDs, and study materials. Data is isolated per user account, designed for long-term personal accumulation of work records, life assets, and digital belongings.'
    ),
    repoUrl: 'https://github.com/gouxinjie/archive',
    deployPath: '/var/www/archive',
    startMode: L(
      'Nuxt Nitro Node Server 生产模式，PM2 进程守护，Nginx 反向代理',
      'Nuxt Nitro Node Server in production mode, PM2 process guardian, Nginx reverse proxy.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 `npm run build` → SCP 上传 `.output` → ECS PM2 reload；生产访问链路为 公网 8081 → Nginx → 127.0.0.1:3000 → Nuxt/PM2',
      'Automated deployment via GitHub Actions: push to main triggers `npm run build` -> SCP upload `.output` -> ECS PM2 reload. Production path: public 8081 -> Nginx -> 127.0.0.1:3000 -> Nuxt/PM2.'
    ),
    port: '内部监听 3000，Nginx 对外暴露 8081',
    url: 'http://archive.gouxinjie.com',
    covers: ['/images/project-cover/archive.png', '/images/project-cover/archive-1.png', '/images/project-cover/archive-2.png', '/images/project-cover/archive-3.png'],
    techStackBrief: L(
      'Nuxt 4、Vue 3、TypeScript、SCSS、Element Plus、SQLite、better-sqlite3',
      'Nuxt 4, Vue 3, TypeScript, SCSS, Element Plus, SQLite, better-sqlite3'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('Nuxt 4 + Vue 3 + TypeScript', 'Nuxt 4 + Vue 3 + TypeScript') },
      { category: L('UI 组件库', 'UI Library'), tech: L('Element Plus + @element-plus/icons-vue', 'Element Plus + @element-plus/icons-vue') },
      { category: L('样式', 'Styling'), tech: L('SCSS（变量、Mixin、BEM 命名），Element Plus 主题', 'SCSS (variables, mixins, BEM naming), Element Plus theme') },
      { category: L('数据库', 'Database'), tech: L('SQLite + better-sqlite3（参数化查询，自动迁移）', 'SQLite + better-sqlite3 (parameterized queries, auto migration)') },
      { category: L('认证', 'Auth'), tech: L('Nuxt Session（签名 Cookie），bcryptjs 密码哈希', 'Nuxt Session (signed cookies), bcryptjs password hashing') },
      { category: L('文件存储', 'File Storage'), tech: L('本地 `uploads/` 目录 + `file_assets` 索引表，签名 Token 预览', 'Local `uploads/` dir + `file_assets` index table, signed-token preview') },
      { category: L('Markdown', 'Markdown'), tech: L('markdown-it（文档渲染）', 'markdown-it (document rendering)') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint + vue-tsc + TypeScript Strict Mode', 'ESLint + vue-tsc + TypeScript Strict Mode') },
      { category: L('包管理', 'Package Manager'), tech: L('npm', 'npm') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（ECS 自动部署，构建 `.env.production` → SCP `.output` → PM2 reload）', 'GitHub Actions (ECS auto-deploy, build `.env.production` -> SCP `.output` -> PM2 reload)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS + Nginx 反向代理 + PM2 进程管理', 'Alibaba Cloud ECS + Nginx reverse proxy + PM2 process manager') }
    ]
  },
  {
    id: 'compress-imgs',
    title: 'compress-imgs',
    category: L('工具', 'Tool'),
    tags: ['FastAPI', 'Python', 'Pillow'],
    featured: false,
    order: 4,
    brief: L('在线图片压缩工具', 'Online Image Compression Tool'),
    description: L(
      '一个类似 TinyPNG 的在线图片无损压缩工具，支持 PNG、JPG、JPEG、WebP 格式。提供拖拽上传、点击选择、实时进度展示、单图下载和批量 ZIP 下载。优先使用 Tinify 云端 API 压缩，无 API Key 时回退到本地 Pillow 压缩。面向个人使用和轻量部署场景，不处理高并发。',
      'A TinyPNG-like online lossless image compression tool supporting PNG, JPG, JPEG, and WebP. Offers drag-and-drop upload, click-to-select, real-time progress, single-image download, and batch ZIP download. Prefers Tinify cloud API compression, falling back to local Pillow when no API key. Aimed at personal use and lightweight deployment, not high concurrency.'
    ),
    repoUrl: 'https://github.com/gouxinjie/compress-imgs',
    deployPath: '/var/www/compress-imgs',
    startMode: L(
      'Uvicorn ASGI Server 生产模式，systemd 进程守护',
      'Uvicorn ASGI Server in production mode, systemd process guardian.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 → rsync 上传源码到 ECS staging → deploy_on_ecs.sh 校验 venv、安装依赖、重启 systemd 服务、健康检查轮询；生产访问链路为用户直连 ECS 8000 端口',
      'Automated deployment via GitHub Actions: push to main triggers -> rsync upload source to ECS staging -> deploy_on_ecs.sh validates venv, installs deps, restarts systemd service, polls health check. Production path: user connects directly to ECS port 8000.'
    ),
    port: '内部监听 8000',
    url: 'http://compress-imgs.gouxinjie.com',
    covers: ['/images/project-cover/compress-imgs.png'],
    techStackBrief: L(
      'FastAPI、Jinja2、原生 JavaScript、CSS、Tinify、Pillow 双引擎压缩、本地文件存储',
      'FastAPI, Jinja2, vanilla JavaScript, CSS, Tinify, Pillow dual-engine compression, local file storage'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('FastAPI 0.115 + Uvicorn 0.34', 'FastAPI 0.115 + Uvicorn 0.34') },
      { category: L('模板引擎', 'Template Engine'), tech: L('Jinja2 3.1（前后端一体，不拆独立前端项目）', 'Jinja2 3.1 (full-stack, no separate frontend project)') },
      { category: L('前端', 'Frontend'), tech: L('原生 JavaScript + 纯 CSS，XMLHttpRequest 上传进度', 'Vanilla JavaScript + pure CSS, XMLHttpRequest upload progress') },
      { category: L('云端压缩', 'Cloud Compression'), tech: L('Tinify（TinyPNG API）', 'Tinify (TinyPNG API)') },
      { category: L('本地压缩', 'Local Compression'), tech: L('Pillow 11.2（JPEG quality=82 progressive, PNG compress_level=9, WebP quality=82 method=6）', 'Pillow 11.2 (JPEG quality=82 progressive, PNG compress_level=9, WebP quality=82 method=6)') },
      { category: L('文件存储', 'File Storage'), tech: L('本地 `work/tmp/runtime/` 目录，上传/压缩结果/ZIP/任务 JSON 分目录存放，30 分钟过期自动清理', 'Local `work/tmp/runtime/` dir; uploads/results/ZIP/task JSON stored separately; auto-cleaned after 30 min') },
      { category: L('API 设计', 'API Design'), tech: L('RESTful，`POST /api/compress` 创建任务 → `GET /api/tasks/{task_id}` 轮询状态', 'RESTful: `POST /api/compress` creates task -> `GET /api/tasks/{task_id}` polls status') },
      { category: L('状态管理', 'State Management'), tech: L('JSON 文件持久化任务状态，不接数据库', 'JSON file persists task state, no database') },
      { category: L('速率限制', 'Rate Limiting'), tech: L('简易滑动窗口限流器，默认每分钟 5 次请求', 'Simple sliding-window rate limiter, default 5 requests/min') },
      { category: L('数据模型', 'Data Model'), tech: L('Pydantic v2（TaskResponseSchema、TaskItemSchema、TaskSummarySchema）', 'Pydantic v2 (TaskResponseSchema, TaskItemSchema, TaskSummarySchema)') },
      { category: L('包管理', 'Package Manager'), tech: L('pip + requirements.txt', 'pip + requirements.txt') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（ECS 自动部署，校验 Secrets → rsync 同步 → deploy_on_ecs.sh 远程执行）', 'GitHub Actions (ECS auto-deploy, validate secrets -> rsync sync -> deploy_on_ecs.sh remote exec)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS + systemd 进程守护', 'Alibaba Cloud ECS + systemd process guardian') }
    ]
  },
  {
    id: 'codeview',
    title: 'codeview',
    category: L('数据可视化', 'Data Visualization'),
    tags: ['React', 'Express', 'ECharts'],
    featured: true,
    order: 5,
    brief: L('GitHub 项目数据可视化看板', 'GitHub Project Data Visualization Dashboard'),
    description: L(
      '一个面向个人开发者的 GitHub 项目数据可视化产品，将分散的 GitHub 仓库数据同步到本地 SQLite 并沉淀为可持续查看的可视化经营面板。支持仓库列表与基础信息同步持久化、提交记录/语言分布/流量数据采集、活跃度趋势与热力图展示、技术栈标签分析、四维度项目评分、自动洞察卡片生成。前端经 Nginx 反向代理透传 `/api` 到 Express 后端，GitHub Token 加密存储并按配置定时增量同步。',
      'A GitHub project data visualization product for individual developers, syncing scattered GitHub repo data into local SQLite and turning it into a persistent, viewable visual dashboard. Supports repo list and basic info sync/persistence, commit/language-traffic collection, activity trends and heatmaps, tech-stack tag analysis, four-dimension project scoring, and auto insight cards. The frontend proxies `/api` to the Express backend via Nginx; GitHub Tokens are encrypted at rest and incrementally synced on a schedule.'
    ),
    repoUrl: 'https://github.com/gouxinjie/codeview',
    deployPath: '/var/www/codeview',
    startMode: L(
      'Docker Compose 编排（server + web + Nginx），GitHub Actions 构建镜像推送到阿里云 ACR 后远程 SSH 触发',
      'Docker Compose orchestration (server + web + Nginx); GitHub Actions builds images and pushes to Alibaba Cloud ACR, then triggers remote SSH.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 → 类型校验 → 构建 server/web 镜像 → 推送 ACR → SSH 解压发布包 → Docker Compose pull + up -d，自动保留最近 2 个版本；用户经 Nginx 反代访问 Express 后端',
      'Automated deployment via GitHub Actions: push to main triggers -> type check -> build server/web images -> push to ACR -> SSH extract release -> Docker Compose pull + up -d, keeping the last 2 versions. Users access the Express backend via Nginx reverse proxy.'
    ),
    port: '内部 node server 监听 3101，对外暴露81端口，通过nginx转发到本地80端口',
    url: 'http://codeview.gouxinjie.com/',
    covers: ['/images/project-cover/codeview.png', '/images/project-cover/codeview-1.png', '/images/project-cover/codeview-2.png', '/images/project-cover/codeview-3.png'],
    techStackBrief: L(
      'Node.js、Express、React、Vite、SQLite、ECharts、GitHub REST API 增量同步',
      'Node.js, Express, React, Vite, SQLite, ECharts, GitHub REST API incremental sync'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('前端 React 18 + Vite 6；后端 Express 4（Node.js + TypeScript）', 'Frontend React 18 + Vite 6; Backend Express 4 (Node.js + TypeScript)') },
      { category: L('语言', 'Language'), tech: L('TypeScript 5.8+（前端 ESNext Bundler 解析，后端 CommonJS）', 'TypeScript 5.8+ (frontend ESNext Bundler, backend CommonJS)') },
      { category: L('样式', 'Styling'), tech: L('SCSS（sass），BEM 语义化命名，全局变量/混入，禁止全局污染', 'SCSS (sass), BEM semantic naming, global variables/mixins, no global pollution') },
      { category: L('图表', 'Charts'), tech: L('ECharts 5.6 + echarts-for-react（热力图/柱状/饼图/雷达/趋势线）', 'ECharts 5.6 + echarts-for-react (heatmap/bar/pie/radar/trend)') },
      { category: L('路由', 'Routing'), tech: L('react-router-dom 7.6，HashRouter，7 个页面', 'react-router-dom 7.6, HashRouter, 7 pages') },
      { category: L('状态管理', 'State Management'), tech: L('Zustand 5.0（同步状态/仓库选择/错误跨组件共享）', 'Zustand 5.0 (sync state / repo selection / cross-component error sharing)') },
      { category: L('数据库', 'Database'), tech: L('better-sqlite3 11.8（SQLite，WAL 模式，外键约束，版本化迁移）', 'better-sqlite3 11.8 (SQLite, WAL mode, FK constraints, versioned migrations)') },
      { category: L('数据校验', 'Validation'), tech: L('Zod 3.24（环境变量 + 请求体/参数运行时校验）', 'Zod 3.24 (env vars + request body/params runtime validation)') },
      { category: L('云端数据', 'Cloud Data'), tech: L('GitHub REST API（仓库/提交/语言/流量/文件内容）', 'GitHub REST API (repos/commits/languages/traffic/file content)') },
      { category: L('Token 安全', 'Token Security'), tech: L('AES-256-CBC 加密存储 + CSRF Token 校验', 'AES-256-CBC encrypted storage + CSRF token validation') },
      { category: L('CORS', 'CORS'), tech: L('基于 WEB_ORIGIN 白名单动态校验，兼容 localhost/127.0.0.1', 'Dynamic WEB_ORIGIN whitelist validation, compatible with localhost/127.0.0.1') },
      { category: L('同步调度', 'Sync Scheduler'), tech: L('setTimeout 精确分钟级定时器（默认 720 分钟），全量/增量双模式', 'setTimeout precise minute-level timer (default 720 min), full/incremental dual mode') },
      { category: L('API 设计', 'API Design'), tech: L('RESTful，统一响应 `{ success, code, message, data }`', 'RESTful, unified response `{ success, code, message, data }`') },
      { category: L('包管理', 'Package Manager'), tech: L('npm workspaces monorepo（server + web 双子包）', 'npm workspaces monorepo (server + web sub-packages)') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（push main → typecheck → build → push ACR → SSH 远程 deploy）', 'GitHub Actions (push main -> typecheck -> build -> push ACR -> SSH remote deploy)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS + Docker Compose（双容器，$CODEVIEW_HTTP_PORT 可配宿主机端口）', 'Alibaba Cloud ECS + Docker Compose (two containers, $CODEVIEW_HTTP_PORT configurable host port)') }
    ]
  },
  {
    id: 'flow-calendar',
    title: 'flow-calendar',
    category: L('应用', 'Application'),
    tags: ['Next.js', 'React 19', 'Prisma'],
    featured: false,
    order: 6,
    brief: L('月历生活记录工具（H5）', 'Monthly Calendar Life Journal (H5)'),
    description: L(
      '一个用来知道"之前做过什么"的记录与回顾工具——不做计划、不设 KPI，只是把已经发生过的生活清晰地留在月历上',
      'A journaling and review tool to remember what you have done before. No planning, no KPIs; it simply leaves life that has already happened clearly marked on a monthly calendar.'
    ),
    repoUrl: 'https://github.com/gouxinjie/flow-calendar',
    deployPath: '/var/www/flow-calendar/app（数据文件独立于 ../data/ 持久化）',
    startMode: L(
      'PM2 fork 单进程守护 → Nginx 反代到 127.0.0.1:3400，GitHub Actions 自动构建 rsync 同步',
      'PM2 fork single-process guardian -> Nginx reverse proxy to 127.0.0.1:3400; GitHub Actions auto-build and rsync sync.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 Next.js standalone 构建 → rsync 同步 → PM2 热重载（零停机）',
      'Automated deployment via GitHub Actions: push to main triggers Next.js standalone build -> rsync sync -> PM2 hot reload (zero downtime).'
    ),
    port: 'Next.js 监听 127.0.0.1:3400，Nginx 反代对外 80',
    url: 'http://flow-calendar.gouxinjie.com',
    covers: ['/images/project-cover/flow-calendar.png', '/images/project-cover/flow-calendar-1.png', '/images/project-cover/flow-calendar-2.png', '/images/project-cover/flow-calendar-3.png'],
    techStackBrief: L(
      'Next.js、React 19、TypeScript、Prisma、SQLite、Tailwind CSS 4、SCSS',
      'Next.js, React 19, TypeScript, Prisma, SQLite, Tailwind CSS 4, SCSS'
    ),
    techStackDetail: [
      { category: L('框架', 'Framework'), tech: L('Next.js + React 19 + TypeScript', 'Next.js + React 19 + TypeScript') },
      { category: L('样式', 'Styling'), tech: L('Tailwind CSS 4 + SCSS，视觉关键词：清透/克制/呼吸感/留白', 'Tailwind CSS 4 + SCSS; visual keywords: airy / restrained / breathing room / whitespace') },
      { category: L('组件库', 'Component Library'), tech: L('antd-mobile 5 + Radix UI（Switch） + Phosphor Icons', 'antd-mobile 5 + Radix UI (Switch) + Phosphor Icons') },
      { category: L('状态管理', 'State Management'), tech: L('Zustand 5（跨组件共享）+ useState（局部状态）', 'Zustand 5 (cross-component sharing) + useState (local state)') },
      { category: L('数据库', 'Database'), tech: L('Prisma 5 + SQLite（可平滑迁移 PostgreSQL）', 'Prisma 5 + SQLite (smooth migration to PostgreSQL)') },
      { category: L('日期处理', 'Date Handling'), tech: L('dayjs + lunar-typescript（农历/节气）', 'dayjs + lunar-typescript (lunar calendar / solar terms)') },
      { category: L('客户端缓存', 'Client Cache'), tech: L('IndexedDB（最近访问缓存，非主数据源）', 'IndexedDB (recent-visit cache, not primary source)') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint 9 + eslint-config-next', 'ESLint 9 + eslint-config-next') },
      { category: L('包管理', 'Package Manager'), tech: L('npm', 'npm') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（ECS 自动部署，rsync 同步）', 'GitHub Actions (ECS auto-deploy, rsync sync)') },
      { category: L('进程守护', 'Process Manager'), tech: L('PM2（fork 单实例，SQLite 不支持多进程写入）', 'PM2 (fork single instance; SQLite does not support multi-process writes)') },
      { category: L('反向代理', 'Reverse Proxy'), tech: L('Nginx（静态资源缓存 + 安全头 + WebSocket 支持）', 'Nginx (static cache + security headers + WebSocket support)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS + Gitee 镜像仓库', 'Alibaba Cloud ECS + Gitee mirror repo') }
    ]
  },
  {
    id: 'weather-dashboard',
    title: 'weather-dashboard',
    category: L('数据可视化', 'Data Visualization'),
    tags: ['React', 'ECharts', 'Docker'],
    featured: false,
    order: 7,
    brief: L('城市天气可视化大屏平台', 'City Weather Visualization Dashboard Platform'),
    description: L(
      '一个用来"一眼看懂此刻城市天气"的聚合与展示工具——不做预测规划，只是把实时天气、空气质量、灾害预警、趋势与统计清晰地留在同一屏上',
      'An aggregation and display tool to understand a city current weather at a glance. No forecasting or planning, just showing real-time weather, air quality, disaster alerts, trends, and statistics clearly on one screen.'
    ),
    repoUrl: 'https://github.com/gouxinjie/weather-dashboard',
    deployPath: '/var/www/weather（数据库由 Docker Volume `weather-data` 持久化到容器内 /app/data/）',
    startMode: L(
      'Docker Compose 双容器（frontend + backend）→ 宿主 Nginx 反代到 127.0.0.1:3200，GitHub Actions 自动构建镜像同步',
      'Docker Compose two containers (frontend + backend) -> host Nginx reverse proxy to 127.0.0.1:3200; GitHub Actions auto-build and sync images.'
    ),
    status: '正常运行',
    remark: L(
      'GitHub Actions 自动部署，push main 触发 docker build 前端+后端镜像 → scp 上传 → ECS docker load + compose up -d（滚动替换）',
      'Automated deployment via GitHub Actions: push to main triggers docker build frontend+backend images -> scp upload -> ECS docker load + compose up -d (rolling replacement).'
    ),
    port: 'frontend 容器 80 → 宿主 3200，backend 仅内网 3201，宿主 Nginx 对外 80',
    url: 'http://weather.gouxinjie.com',
    covers: ['/images/project-cover/weather-dashboard.png'],
    techStackBrief: L(
      'React 18、Vite、TypeScript 前端、ECharts 图表、Node.js、Express、TypeScript 后端、SQLite、Docker Compose 部署',
      'React 18, Vite, TypeScript frontend, ECharts, Node.js, Express, TypeScript backend, SQLite, Docker Compose deployment'
    ),
    techStackDetail: [
      { category: L('前端框架', 'Frontend'), tech: L('React 18 + Vite + TypeScript', 'React 18 + Vite + TypeScript') },
      { category: L('路由', 'Routing'), tech: L('React Router 6', 'React Router 6') },
      { category: L('状态管理', 'State Management'), tech: L('Zustand 4（跨组件共享）+ useState（局部状态）', 'Zustand 4 (cross-component sharing) + useState (local state)') },
      { category: L('图表', 'Charts'), tech: L('ECharts 5', 'ECharts 5') },
      { category: L('样式', 'Styling'), tech: L('SCSS（语义化 className，BEM 规范）', 'SCSS (semantic className, BEM convention)') },
      { category: L('后端', 'Backend'), tech: L('Node.js + Express 4 + TypeScript', 'Node.js + Express 4 + TypeScript') },
      { category: L('数据库', 'Database'), tech: L('SQLite（better-sqlite3，WAL 模式）', 'SQLite (better-sqlite3, WAL mode)') },
      { category: L('数据源', 'Data Source'), tech: L('和风天气 QWeather API（后端集中转发与聚合，前端不直连）', 'QWeather API (backend centralized forwarding & aggregation, frontend not directly connected)') },
      { category: L('缓存', 'Cache'), tech: L('内存缓存 + SQLite 快照兜底（实时天气 10min / 趋势 30min / 预报 60min TTL）', 'In-memory cache + SQLite snapshot fallback (realtime 10min / trend 30min / forecast 60min TTL)') },
      { category: L('容器编排', 'Orchestration'), tech: L('Docker + Docker Compose（双容器 bridge 网络）', 'Docker + Docker Compose (two-container bridge network)') },
      { category: L('反向代理', 'Reverse Proxy'), tech: L('Nginx（宿主 80 分流 + 前端容器 Nginx 反代 /api）', 'Nginx (host 80 routing + frontend container Nginx proxies /api)') },
      { category: L('部署', 'Deployment'), tech: L('阿里云 ECS', 'Alibaba Cloud ECS') },
      { category: L('CI/CD', 'CI/CD'), tech: L('GitHub Actions（镜像构建 + SCP 同步 + compose 滚动更新）', 'GitHub Actions (image build + SCP sync + compose rolling update)') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint 8 + @typescript-eslint / eslint-plugin-react', 'ESLint 8 + @typescript-eslint / eslint-plugin-react') },
      { category: L('包管理', 'Package Manager'), tech: L('npm', 'npm') }
    ]
  },

  {
    id: 'gouxinjie',
    title: 'gouxinjie',
    category: L('其他', 'Other'),
    tags: ['md'],
    featured: false,
    order: 8,
    brief: L('github的个人主页介绍页面', 'GitHub Personal Profile Page'),
    description: L(
      '这个项目是一个github的个人主页介绍页面，只有一个md，仓库命名需要和用户名保持一致且公开',
      'A GitHub personal profile README project, a single markdown file whose repo name must match the username and be public.'
    ),
    repoUrl: 'https://github.com/gouxinjie',
    deployPath: '',
    startMode: L('', ''),
    status: '正常运行',
    remark: L('', ''),
    port: '',
    url: 'https://github.com/gouxinjie',
    covers: [
      '/images/project-cover/gouxinjie.png',
      '/images/project-cover/gouxinjie-1.png'
    ],
    techStackBrief: L('md', 'Markdown'),
    techStackDetail: []
  },

  /**
   * 下面是未上线的项目
   */
  {
    id: 'it-project-console',
    title: 'IT-Project-Console',
    category: L('平台', 'Platform'),
    tags: ['React', 'FastAPI', 'MySQL', 'TypeScript', 'Ant Design'],
    featured: false,
    order: 9,
    brief: L('企业 IT 项目交付与资源统一管理平台', 'Enterprise IT Project Delivery & Resource Management Platform'),
    description: L(
      '一个把项目基础信息、前后端资源、成员、外部依赖（OSS/数据库/Redis/中间件）和账号权限收口到一个控制台的企业内部管理工具——方便日常维护、交接与审计。包含项目总览仪表盘、项目管理、成员管理、外部资源管理、账号管理与登录注册等模块，支持角色权限、公开注册开关与 Bearer JWT 认证。',
      'An internal enterprise management tool that consolidates project basics, frontend/backend resources, members, external dependencies (OSS/DB/Redis/middleware), and account permissions into one console, for daily maintenance, handover, and auditing. Includes a project overview dashboard, project management, member management, external resource management, account management, and login/registration, with role-based permissions, a public-registration switch, and Bearer JWT auth.'
    ),
    repoUrl: 'https://github.com/gouxinjie/it-project-console',
    deployPath: '',
    startMode: L(
      '本地启动：运行 setup_and_start.bat（一键初始化依赖、同步管理员配置并拉起前后端），或手动 `python -m uvicorn app.main:app` 启动后端（8000）+ `pnpm run dev` 启动前端（Vite 3000，代理 /api 到 8000）',
      'Local: run setup_and_start.bat (one-click dependency init, sync admin config, and start frontend/backend), or manually `python -m uvicorn app.main:app` for backend (8000) + `pnpm run dev` for frontend (Vite 3000, proxy /api to 8000).'
    ),
    status: '未发布',
    remark: L('', ''),
    port: '',
    url: null,
    covers: ['/images/project-cover/it-project-console.png', '/images/project-cover/it-project-console-1.png', '/images/project-cover/it-project-console-2.png', '/images/project-cover/it-project-console-3.png', '/images/project-cover/it-project-console-4.png'],
    techStackBrief: L(
      'React 18 + Vite + TypeScript 前端、Ant Design 5、Tailwind CSS、React Router 6、Axios、ECharts；FastAPI + SQLAlchemy 2.0 + MySQL 后端、Pydantic v2、JWT（python-jose）认证、passlib[bcrypt] 密码哈希',
      'React 18 + Vite + TypeScript frontend, Ant Design 5, Tailwind CSS, React Router 6, Axios, ECharts; FastAPI + SQLAlchemy 2.0 + MySQL backend, Pydantic v2, JWT (python-jose) auth, passlib[bcrypt] password hashing'
    ),
    techStackDetail: [
      { category: L('前端框架', 'Frontend'), tech: L('React 18 + Vite + TypeScript', 'React 18 + Vite + TypeScript') },
      { category: L('UI 组件库', 'UI Library'), tech: L('Ant Design 5（+ @ant-design/icons）', 'Ant Design 5 (+ @ant-design/icons)') },
      { category: L('样式', 'Styling'), tech: L('Tailwind CSS 3 + SCSS（sass）', 'Tailwind CSS 3 + SCSS (sass)') },
      { category: L('路由', 'Routing'), tech: L('React Router 6', 'React Router 6') },
      { category: L('HTTP 客户端', 'HTTP Client'), tech: L('Axios', 'Axios') },
      { category: L('图表', 'Charts'), tech: L('ECharts 5（echarts-for-react）', 'ECharts 5 (echarts-for-react)') },
      { category: L('日期处理', 'Date Handling'), tech: L('dayjs', 'dayjs') },
      { category: L('后端框架', 'Backend'), tech: L('FastAPI + Uvicorn', 'FastAPI + Uvicorn') },
      { category: L('ORM', 'ORM'), tech: L('SQLAlchemy 2.0', 'SQLAlchemy 2.0') },
      { category: L('数据库', 'Database'), tech: L('MySQL 5.7 / 8.0（PyMySQL 驱动）', 'MySQL 5.7 / 8.0 (PyMySQL driver)') },
      { category: L('数据校验', 'Validation'), tech: L('Pydantic v2 + pydantic-settings', 'Pydantic v2 + pydantic-settings') },
      { category: L('认证', 'Auth'), tech: L('JWT（python-jose）+ passlib[bcrypt] 密码哈希', 'JWT (python-jose) + passlib[bcrypt] password hashing') },
      { category: L('数据库迁移', 'DB Migration'), tech: L('Alembic', 'Alembic') },
      { category: L('配置', 'Config'), tech: L('python-dotenv（.env）', 'python-dotenv (.env)') },
      { category: L('包管理', 'Package Manager'), tech: L('前端 pnpm / npm；后端 pip', 'Frontend pnpm / npm; Backend pip') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint（前端）', 'ESLint (frontend)') }
    ]
  },
  /**
   * 未上线的项目：deepxinjie
   */
  {
    id: 'deepxinjie',
    title: 'deepxinjie',
    category: L('应用', 'Application'),
    tags: ['React', 'FastAPI', 'MySQL', 'TypeScript'],
    featured: false,
    order: 10,
    brief: L('AI 聊天平台', 'AI Chat Platform'),
    description: L(
      '一个前后端分离的 AI 聊天项目，产品形态参考企业级 AI 聊天网站——支持账号密码注册登录、基于 Access/Refresh Token 与 CSRF 的登录态管理、流式聊天输出与中断、深度思考模式、联网搜索与来源展示、会话管理（新建/历史/重命名/置顶/删除）以及桌面端和移动端双端适配',
      'A decoupled front/back AI chat project modeled after enterprise AI chat sites, supporting account/password signup & login, Access/Refresh Token + CSRF session management, streaming chat output with interruption, deep-thinking mode, web search with source display, conversation management (new/history/rename/pin/delete), and desktop + mobile adaptation.'
    ),
    repoUrl: 'https://github.com/gouxinjie/deepxinjie',
    deployPath: '',
    startMode: L('', ''),
    status: '未发布',
    remark: L('', ''),
    port: '',
    url: null,
    covers: ['/images/project-cover/deepxinjie.png', '/images/project-cover/deepxinjie-1.png', '/images/project-cover/deepxinjie-2.png', '/images/project-cover/deepxinjie-3.png', '/images/project-cover/deepxinjie-4.png'],
    techStackBrief: L(
      'React 19、Vite 8、TypeScript 5 前端、React Router 7、Zustand 状态管理、Axios 请求、Sass/SCSS 样式、FastAPI + Uvicorn 后端、MySQL 8 数据库、PyJWT + passlib 鉴权、OpenAI Python SDK 模型接入',
      'React 19, Vite 8, TypeScript 5 frontend, React Router 7, Zustand, Axios, Sass/SCSS, FastAPI + Uvicorn backend, MySQL 8, PyJWT + passlib auth, OpenAI Python SDK model integration'
    ),
    techStackDetail: [
      { category: L('前端框架', 'Frontend'), tech: L('React 19 + Vite 8 + TypeScript 5', 'React 19 + Vite 8 + TypeScript 5') },
      { category: L('路由', 'Routing'), tech: L('React Router 7', 'React Router 7') },
      { category: L('状态管理', 'State Management'), tech: L('Zustand（跨组件共享）+ useState（局部状态）', 'Zustand (cross-component sharing) + useState (local state)') },
      { category: L('请求', 'HTTP Client'), tech: L('Axios', 'Axios') },
      { category: L('样式', 'Styling'), tech: L('Sass / SCSS', 'Sass / SCSS') },
      { category: L('Markdown 渲染', 'Markdown'), tech: L('react-markdown + remark-gfm + rehype-highlight', 'react-markdown + remark-gfm + rehype-highlight') },
      { category: L('图标', 'Icons'), tech: L('lucide-react', 'lucide-react') },
      { category: L('后端', 'Backend'), tech: L('FastAPI + Uvicorn', 'FastAPI + Uvicorn') },
      { category: L('数据库', 'Database'), tech: L('MySQL 8 + mysql-connector-python', 'MySQL 8 + mysql-connector-python') },
      { category: L('鉴权', 'Auth'), tech: L('PyJWT + passlib[bcrypt]（Access Token + Refresh Token + CSRF Token）', 'PyJWT + passlib[bcrypt] (Access + Refresh + CSRF Token)') },
      { category: L('模型接入', 'Model Integration'), tech: L('OpenAI Python SDK（兼容 DeepSeek 等接口）', 'OpenAI Python SDK (compatible with DeepSeek etc.)') },
      { category: L('联网搜索', 'Web Search'), tech: L('Tavily Search API', 'Tavily Search API') },
      { category: L('配置', 'Config'), tech: L('python-dotenv', 'python-dotenv') },
      { category: L('运行环境', 'Runtime'), tech: L('Node.js 20+ / Python 3.11+ / MySQL 8+', 'Node.js 20+ / Python 3.11+ / MySQL 8+') },
      { category: L('包管理', 'Package Manager'), tech: L('npm（前端）/ pip（后端）', 'npm (frontend) / pip (backend)') },
      { category: L('代码质量', 'Code Quality'), tech: L('ESLint', 'ESLint') }
    ]
  },
  {
    id: 'animated-login-react',
    title: 'Animated Login React',
    category: L('应用', 'Application'),
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'CSS Animation'],
    featured: false,
    order: 11,
    brief: L('有趣的交互式动画登录页', 'Fun Interactive Animated Login Page'),
    description: L(
      '一个基于 React + Vite 的交互式登录页示例。页面左侧是会响应用户操作的抽象角色动画（眼球跟随鼠标、随机眨眼、回避/偷看密码、提交结果反馈），右侧是带邮箱与密码校验、显示/隐藏密码、提交状态反馈的演示登录表单。重点在状态联动、角色反馈和按钮动效，而非真实后端认证——登录流程为前端模拟（正确密码固定为 123456，成功触发庆祝动效，失败触发回弹反馈）。',
      'A React + Vite interactive login page demo. The left side shows an abstract character animation that responds to the user (eyes follow the cursor, random blinks, avoids/peeks at the password, reacts to submit results); the right side is a demo login form with email/password validation, show/hide password, and submit-state feedback. The focus is on state linkage, character feedback, and button motion, not real backend auth. The login flow is front-end simulated (correct password fixed as 123456; success triggers a celebration animation, failure a bounce-back).'
    ),
    repoUrl: 'https://github.com/gouxinjie/animatedLogin-react',
    deployPath: '',
    startMode: L(
      '本地启动：`npm install` 安装依赖，然后 `npm run dev` 启动 Vite 开发服务器（默认 http://localhost:5173）；`npm run build` 构建，或 `npm run preview` 预览产物',
      'Local: `npm install` to install deps, then `npm run dev` to start the Vite dev server (default http://localhost:5173); `npm run build` to build, or `npm run preview` to preview.'
    ),
    status: '未发布',
    remark: L('', ''),
    port: '5173',
    url: null,
    covers: [
      '/images/project-cover/animated-login-react.png',
      '/images/project-cover/animated-login-react-1.png',
      '/images/project-cover/animated-login-react-2.png',
      '/images/project-cover/animated-login-react-3.png',
    ],
    techStackBrief: L(
      'React 18 + Vite 5 前端、Tailwind CSS 4、Framer Motion 12 动画、原生 CSS 关键帧动画、JavaScript (JSX)',
      'React 18 + Vite 5 frontend, Tailwind CSS 4, Framer Motion 12 animation, native CSS keyframe animation, JavaScript (JSX)'
    ),
    techStackDetail: [
      { category: L('前端框架', 'Frontend'), tech: L('React 18 + Vite 5', 'React 18 + Vite 5') },
      { category: L('样式', 'Styling'), tech: L('Tailwind CSS 4 + 原生 CSS 关键帧动画', 'Tailwind CSS 4 + native CSS keyframe animation') },
      { category: L('动画', 'Animation'), tech: L('Framer Motion 12', 'Framer Motion 12') },
      { category: L('语言', 'Language'), tech: L('JavaScript（JSX）', 'JavaScript (JSX)') },
      { category: L('构建', 'Build'), tech: L('Vite 5', 'Vite 5') },
      { category: L('包管理', 'Package Manager'), tech: L('npm', 'npm') }
    ]
  },
  {
    id: "my-dify-chat",
    title: "My Dify Chat",
    category: L("应用", "Application"),
    tags: ["React", "Next.js", "Monorepo", "Tailwind CSS", "Prisma", "Ant Design", "TypeScript"],
    featured: false,
    order: 12,
    brief: L("基于 Dify 的企业级 AI 聊天与管理平台", "Enterprise-grade AI Chat & Management Platform based on Dify"),
    description: L(
      "My Dify Chat 是基于开源 Dify Chat 二次开发的企业级聊天应用解决方案，采用现代化的 pnpm Monorepo 架构。项目集成了 Dify AI 能力，提供可扩展、易维护的聊天机器人前端及可视化管理平台。包含独立的 Next.js 管理后台（负责用户认证、应用配置、数据库管理、API 代理）与 React + RSBuild 沉浸式聊天前端，并深度集成钉钉免登及工作台访问，支持 SQLite / MySQL / PostgreSQL 多数据库与多环境（本地 / UAT / 生产）部署。",
      "My Dify Chat is an enterprise-grade chat application solution built on the open-source Dify Chat, using a modern pnpm Monorepo architecture. It integrates Dify AI capabilities and provides an extensible, maintainable chatbot frontend and a visual management platform. It includes a standalone Next.js admin backend (user auth, app config, DB management, API proxy) and a React + RSBuild immersive chat frontend, with deep DingTalk password-free login and workspace access, supporting SQLite / MySQL / PostgreSQL and multi-environment (local / UAT / production) deployment."
    ),
    repoUrl: "https://gitee.com/gou-xinjie/my-dify-chat",
    deployPath: "",
    startMode: L(
      "本地启动：根目录执行 `pnpm install` 安装依赖；初始化数据库（默认 MySQL）`pnpm --filter dify-chat-platform db:push`，创建管理员 `pnpm --filter dify-chat-platform create-admin`；启动管理后台 `pnpm dev:platform`（http://localhost:5300），启动聊天应用 `pnpm dev:react`（http://localhost:5200）。生产构建：`pnpm build`；支持 Docker Compose 部署。",
      "Local: run `pnpm install` at root; init DB (default MySQL) `pnpm --filter dify-chat-platform db:push`; create admin `pnpm --filter dify-chat-platform create-admin`; start admin `pnpm dev:platform` (http://localhost:5300), start chat `pnpm dev:react` (http://localhost:5200). Production: `pnpm build`; Docker Compose supported."
    ),
    status: "未发布",
    remark: L('', ''),
    port: "5300",
    url: null,
    covers: [
      '/images/project-cover/my-dify-chat.png',
      '/images/project-cover/my-dify-chat-1.png',
    ],
    techStackBrief: L(
      "React 19 + Next.js 15 管理后台、React 19 + RSBuild 聊天前端、TypeScript、Ant Design 6、Tailwind CSS（v3/v4）、Prisma ORM、NextAuth.js 认证、Zustand 状态管理、pnpm Monorepo",
      "React 19 + Next.js 15 admin, React 19 + RSBuild chat frontend, TypeScript, Ant Design 6, Tailwind CSS (v3/v4), Prisma ORM, NextAuth.js auth, Zustand, pnpm Monorepo"
    ),
    techStackDetail: [
      { category: L("前端框架", "Frontend"), tech: L("React 19 + Next.js 15（platform）、React 19 + RSBuild（react-app）", "React 19 + Next.js 15 (platform), React 19 + RSBuild (react-app)") },
      { category: L("构建工具", "Build Tool"), tech: L("RSBuild、RSLib、pnpm workspace", "RSBuild, RSLib, pnpm workspace") },
      { category: L("UI 系统", "UI System"), tech: L("Ant Design 6、Tailwind CSS（react-app v3 / platform v4）、Lucide Icons", "Ant Design 6, Tailwind CSS (react-app v3 / platform v4), Lucide Icons") },
      { category: L("状态管理", "State Management"), tech: L("React Hooks、Zustand", "React Hooks, Zustand") },
      { category: L("数据持久化", "Persistence"), tech: L("Prisma ORM（SQLite / MySQL / PostgreSQL）", "Prisma ORM (SQLite / MySQL / PostgreSQL)") },
      { category: L("认证方案", "Auth"), tech: L("NextAuth.js", "NextAuth.js") },
      { category: L("语言", "Language"), tech: L("TypeScript", "TypeScript") },
      { category: L("质量保证", "Quality"), tech: L("ESLint、Prettier、Biome、Vitest", "ESLint, Prettier, Biome, Vitest") },
      { category: L("包管理", "Package Manager"), tech: L("pnpm", "pnpm") }
    ]
  },
  {
    "id": "life-record-hub",
    "title": "life-record-hub",
    "category": L("应用", "Application"),
    "tags": ["React", "FastAPI", "MySQL", "TypeScript", "Python"],
    "featured": false,
    "order": 13,
    "brief": L("个人生活记录效率助手", "Personal Life-logging Productivity Assistant"),
    "description": L(
      "一个基于 FastAPI + React + MySQL 驱动的现代化个人事务管理效率助手。支持富文本/Markdown 双格式笔记、待办事项管理（优先级/星标/截止日期）、每日打卡习惯追踪（可视化进度）、体重趋势记录与目标管理、食谱收藏与管理，以及响应式多主题切换",
      "A modern personal task-management productivity assistant powered by FastAPI + React + MySQL. Supports rich-text / Markdown dual-format notes, todo management (priority / star / due date), daily habit tracking with visual progress, weight-trend logging and goal management, recipe collection and management, plus responsive multi-theme switching."
    ),
    "repoUrl": "https://github.com/gouxinjie/life-record-hub",
    "deployPath": "",
    "startMode": L('', ''),
    "status": "未发布",
    "remark": L('', ''),
    "port": "",
    "url": null,
    "covers": ['/images/project-cover/life-record-hub.png', '/images/project-cover/life-record-hub-1.png', '/images/project-cover/life-record-hub-2.png', '/images/project-cover/life-record-hub-3.png', '/images/project-cover/life-record-hub-4.png'],
    "techStackBrief": L(
      "React 18、Vite 5、TypeScript 5 前端、React Router 6、Ant Design 5 + Tailwind CSS + SCSS 样式、Axios 请求、React Context 状态管理、FastAPI + Uvicorn 后端、MySQL 8 数据库、SQLAlchemy 2.0 ORM、OAuth2 + JWT + bcrypt 鉴权",
      "React 18, Vite 5, TypeScript 5 frontend, React Router 6, Ant Design 5 + Tailwind CSS + SCSS, Axios, React Context state, FastAPI + Uvicorn backend, MySQL 8, SQLAlchemy 2.0 ORM, OAuth2 + JWT + bcrypt auth"
    ),
    "techStackDetail": [
      { "category": L("前端框架", "Frontend"), "tech": L("React 18.2 + Vite 5.0 + TypeScript 5.2", "React 18.2 + Vite 5.0 + TypeScript 5.2") },
      { "category": L("路由", "Routing"), "tech": L("React Router DOM v6", "React Router DOM v6") },
      { "category": L("状态管理", "State Management"), "tech": L("React Context（ThemeContext 主题切换）", "React Context (ThemeContext theme switching)") },
      { "category": L("UI 组件库", "UI Library"), "tech": L("Ant Design 5.11 + @ant-design/icons 5.2", "Ant Design 5.11 + @ant-design/icons 5.2") },
      { "category": L("样式方案", "Styling"), "tech": L("Tailwind CSS 3.4 + SCSS/SCSS Modules + CSS 变量主题", "Tailwind CSS 3.4 + SCSS/SCSS Modules + CSS variable theming") },
      { "category": L("请求", "HTTP Client"), "tech": L("Axios（拦截器自动注入 Bearer Token，统一错误处理）", "Axios (interceptor auto-injects Bearer Token, unified error handling)") },
      { "category": L("富文本编辑器", "Rich Text Editor"), "tech": L("react-quill-new 3.7（Quill）", "react-quill-new 3.7 (Quill)") },
      { "category": L("Markdown 渲染", "Markdown"), "tech": L("react-markdown 10.1 + remark-gfm 4.0", "react-markdown 10.1 + remark-gfm 4.0") },
      { "category": L("图表", "Charts"), "tech": L("Recharts 2.9（体重趋势可视化）", "Recharts 2.9 (weight-trend visualization)") },
      { "category": L("日期处理", "Date Handling"), "tech": L("dayjs 1.11", "dayjs 1.11") },
      { "category": L("后端", "Backend"), "tech": L("FastAPI 0.104 + Uvicorn 0.24（ASGI）", "FastAPI 0.104 + Uvicorn 0.24 (ASGI)") },
      { "category": L("数据库", "Database"), "tech": L("MySQL 8.0 + PyMySQL 1.1 + SQLAlchemy 2.0 ORM", "MySQL 8.0 + PyMySQL 1.1 + SQLAlchemy 2.0 ORM") },
      { "category": L("鉴权", "Auth"), "tech": L("OAuth2 Password Flow + python-jose JWT + passlib[bcrypt]", "OAuth2 Password Flow + python-jose JWT + passlib[bcrypt]") },
      { "category": L("数据校验", "Validation"), "tech": L("Pydantic 2.5 + pydantic-settings 2.1", "Pydantic 2.5 + pydantic-settings 2.1") },
      { "category": L("文件上传", "File Upload"), "tech": L("python-multipart", "python-multipart") },
      { "category": L("配置", "Config"), "tech": L("python-dotenv", "python-dotenv") },
      { "category": L("运行环境", "Runtime"), "tech": L("Node.js 18+ / Python 3.8+ / MySQL 8.0+", "Node.js 18+ / Python 3.8+ / MySQL 8.0+") },
      { "category": L("包管理", "Package Manager"), "tech": L("pnpm（前端）/ pip（后端）", "pnpm (frontend) / pip (backend)") },
      { "category": L("Monorepo 启动", "Monorepo"), "tech": L("concurrently（跨平台并行启动前后端）", "concurrently (cross-platform parallel start of frontend/backend)") }
    ]
  }
];
