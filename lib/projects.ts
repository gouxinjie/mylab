/**
 * @file 项目数据集（类型定义与全量项目数据）
 * @description 定义 Project 相关类型，并维护所有项目的展示/筛选/运维数据
 * @author gouxinjie
 */

/**
 * 单个技术栈条目的类型
 */
export interface TechItem {
    /** 技术分类，如 "框架"、"样式" */
    category: string;
    /** 具体技术描述 */
    tech: string;
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
    /** 项目标题（显示名称） */
    title: string;
    /** 项目简述（一句话概括） */
    brief: string;
    /** 项目详细描述 */
    description: string;
    /** 项目仓库地址，若无则 null */
    repoUrl: string | null;
    /** 服务器部署路径 */
    deployPath: string;
    /** 启动方式与部署流程说明 */
    startMode: string;
    /** 当前运行状态 */
    status: ProjectStatus;
    /** 项目分类（用于展示与筛选） */
    category: ProjectCategory;
    /** 项目标签（比分类更细的展示与筛选维度） */
    tags: string[];
    /** 是否精选（用于首页/精选专区优先展示） */
    featured: boolean;
    /** 排序权重（数值越小越靠前） */
    order: number;
    /** 补充备注（如 CI/CD 细节） */
    remark: string;
    /** 端口信息（内外部监听情况） */
    port: string;
    /** 公网访问 URL，若无则 null */
    url: string | null;
    /** 项目封面/轮播图列表（字符串数组，第一张为封面，用于轮播展示） */
    covers: string[];
    /** 技术栈简述（一句话概括，用顿号分隔） */
    techStackBrief: string;
    /** 详细技术栈列表（分类 + 技术） */
    techStackDetail: TechItem[];
}

/**
 * 所有项目的数组（可直接用于展示或数据处理）
 */
export const projects: Project[] = [
    {
        id: 'blog',
        title: 'blog',
        category: '学习研究',
        tags: ['VitePress', 'Vue 3', 'TypeScript'],
        featured: true,
        order: 1,
        brief: '我的技术博客系统',
        description: '从前端基础到框架实战，从编码提效到工程化部署，记录每个真实项目的踩坑、决策和复盘——不追热点，写自己验证过的东西',
        repoUrl: 'https://github.com/gouxinjie/gouxinjie.github.io',
        deployPath: '/var/www/blog',
        startMode: 'Nginx 直接托管静态文件，GitHub Actions 构建后 SCP 上传到 ECS',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 vitepress build → SCP 上传 dist → ECS Nginx reload',
        port: '直接监听的本地80端口',
        url: 'http://gouxinjie.com',
        covers: ['/images/project-cover/blog.png'],
        techStackBrief: 'VitePress、Vue 3、TypeScript、Sass、TailwindCSS、Algolia 搜索',
        techStackDetail: [
            { category: '框架', tech: 'VitePress + Vue 3 + TypeScript' },
            { category: '样式', tech: 'Sass + TailwindCSS，Google Fonts (Inter / JetBrains Mono)' },
            { category: '搜索', tech: 'Algolia DocSearch' },
            { category: '图表', tech: 'Mermaid (vitepress-plugin-mermaid)' },
            { category: '交互', tech: 'medium-zoom 图片预览、NProgress 进度条、canvas-confetti 特效' },
            { category: '统计', tech: 'Busuanzi 访问量' },
            { category: '代码质量', tech: 'ESLint + Prettier + vue-tsc' },
            { category: '包管理', tech: 'pnpm' },
            { category: 'CI/CD', tech: 'GitHub Actions（ECS 自动部署 + GitHub Pages）' },
            { category: '部署', tech: 'GitHub Pages / Vercel / 阿里云 ECS / Gitee Pages' }
        ]
    },
    {
        id: 'prompt',
        title: 'Prompt Gallery',
        category: '平台',
        tags: ['Next.js', 'React 19', 'Supabase'],
        featured: true,
        order: 2,
        brief: '我的提示词案例库平台',
        description: '一个支持管理、展示和投稿 AI 图片生成提示词的完整平台。用户可以按分类/风格/场景筛选浏览案例库、收藏案例、一键复制提示词和下载图片；管理员可发布案例、审核投稿、维护标签体系和查看数据统计——从展示到管理，功能闭环完整。',
        repoUrl: 'https://github.com/gouxinjie/prompt-template-studio',
        deployPath: '/var/www/prompt',
        startMode: 'Next.js standalone server 由 PM2 管理，Nginx 反向代理到 `127.0.0.1:5174`，GitHub Actions 构建后 rsync 上传到 ECS',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 `npm run build` → 生成 standalone 运行产物 → rsync 上传 deploy-artifact 到 ECS → PM2 重载 Node 服务 → Nginx reload',
        port: 'Nginx 监听 8080 端口反代到 5174（PM2 管理 Node 进程）',
        url: 'http://prompt.gouxinjie.com',
        covers: ['/images/project-cover/prompt.png'],
        techStackBrief: 'Next.js 16、React 19、TypeScript、Supabase、SCSS Modules、Radix UI',
        techStackDetail: [
            { category: '框架', tech: 'Next.js + React 19 + TypeScript' },
            { category: '路由', tech: 'React Router 7（页面路由）+ Next.js API Route（接口适配）' },
            { category: '样式', tech: 'SCSS Modules + TailwindCSS + CSS Variables（双主题）' },
            { category: '后端正交层', tech: 'Supabase Auth / Postgres / RLS / RPC' },
            { category: 'UI 组件', tech: 'Radix UI (Dialog / Select / AlertDialog / Slot)' },
            { category: '表格', tech: 'TanStack Table' },
            { category: '图标', tech: 'Lucide React' },
            { category: 'Toast', tech: 'Sonner' },
            { category: '存储', tech: '阿里云 OSS 浏览器直传' },
            { category: '校验', tech: 'Zod' },
            { category: '包管理', tech: 'npm' },
            { category: 'CI/CD', tech: 'GitHub Actions（ECS 自动部署）+ EdgeOne Pages' },
            { category: '部署', tech: '阿里云 ECS（PM2 + Nginx 反向代理）、EdgeOne Pages' },
            { category: '数据库', tech: 'Supabase Postgres（16 个迁移文件，含 RLS/RPC/触发器）' }
        ]
    },
    {
        id: 'archive',
        title: 'archive',
        category: '应用',
        tags: ['Nuxt 4', 'Vue 3', 'SQLite'],
        featured: false,
        order: 3,
        brief: '我的个人档案管理系统',
        description: '一个本地优先的私人资料管理系统，集中保存和管理账号密码、文档资料、简历文件、图片、证件和学习资料。按用户账号隔离数据，面向个人长期沉淀工作记录、生活资料和数字资产。',
        repoUrl: 'https://github.com/gouxinjie/archive',
        deployPath: '/var/www/archive',
        startMode: 'Nuxt Nitro Node Server 生产模式，PM2 进程守护，Nginx 反向代理',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 `npm run build` → SCP 上传 `.output` → ECS PM2 reload；生产访问链路为 公网 8081 → Nginx → 127.0.0.1:3000 → Nuxt/PM2',
        port: '内部监听 3000，Nginx 对外暴露 8081',
        url: 'http://archive.gouxinjie.com',
        covers: ['/images/project-cover/archive.png', '/images/project-cover/archive-1.png', '/images/project-cover/archive-2.png', '/images/project-cover/archive-3.png'],
        techStackBrief: 'Nuxt 4、Vue 3、TypeScript、SCSS、Element Plus、SQLite、better-sqlite3',
        techStackDetail: [
            { category: '框架', tech: 'Nuxt 4 + Vue 3 + TypeScript' },
            { category: 'UI 组件库', tech: 'Element Plus + @element-plus/icons-vue' },
            { category: '样式', tech: 'SCSS（变量、Mixin、BEM 命名），Element Plus 主题' },
            { category: '数据库', tech: 'SQLite + better-sqlite3（参数化查询，自动迁移）' },
            { category: '认证', tech: 'Nuxt Session（签名 Cookie），bcryptjs 密码哈希' },
            { category: '文件存储', tech: '本地 `uploads/` 目录 + `file_assets` 索引表，签名 Token 预览' },
            { category: 'Markdown', tech: 'markdown-it（文档渲染）' },
            { category: '代码质量', tech: 'ESLint + vue-tsc + TypeScript Strict Mode' },
            { category: '包管理', tech: 'npm' },
            { category: 'CI/CD', tech: 'GitHub Actions（ECS 自动部署，构建 `.env.production` → SCP `.output` → PM2 reload）' },
            { category: '部署', tech: '阿里云 ECS + Nginx 反向代理 + PM2 进程管理' }
        ]
    },
    {
        id: 'compress-imgs',
        title: 'compress-imgs',
        category: '工具',
        tags: ['FastAPI', 'Python', 'Pillow'],
        featured: false,
        order: 4,
        brief: '我的个人在线图片压缩工具',
        description: '一个类似 TinyPNG 的在线图片无损压缩工具，支持 PNG、JPG、JPEG、WebP 格式。提供拖拽上传、点击选择、实时进度展示、单图下载和批量 ZIP 下载。优先使用 Tinify 云端 API 压缩，无 API Key 时回退到本地 Pillow 压缩。面向个人使用和轻量部署场景，不处理高并发。',
        repoUrl: 'https://github.com/gouxinjie/compress-imgs',
        deployPath: '/var/www/compress-imgs',
        startMode: 'Uvicorn ASGI Server 生产模式，systemd 进程守护',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 → rsync 上传源码到 ECS staging → deploy_on_ecs.sh 校验 venv、安装依赖、重启 systemd 服务、健康检查轮询；生产访问链路为用户直连 ECS 8000 端口',
        port: '内部监听 8000',
        url: 'http://compress-imgs.gouxinjie.com',
        covers: ['/images/project-cover/compress-imgs.png'],
        techStackBrief: 'FastAPI、Jinja2、原生 JavaScript、CSS、Tinify、Pillow 双引擎压缩、本地文件存储',
        techStackDetail: [
            { category: '框架', tech: 'FastAPI 0.115 + Uvicorn 0.34' },
            { category: '模板引擎', tech: 'Jinja2 3.1（前后端一体，不拆独立前端项目）' },
            { category: '前端', tech: '原生 JavaScript + 纯 CSS，XMLHttpRequest 上传进度' },
            { category: '云端压缩', tech: 'Tinify（TinyPNG API）' },
            { category: '本地压缩', tech: 'Pillow 11.2（JPEG quality=82 progressive, PNG compress_level=9, WebP quality=82 method=6）' },
            { category: '文件存储', tech: '本地 `work/tmp/runtime/` 目录，上传/压缩结果/ZIP/任务 JSON 分目录存放，30 分钟过期自动清理' },
            { category: 'API 设计', tech: 'RESTful，`POST /api/compress` 创建任务 → `GET /api/tasks/{task_id}` 轮询状态' },
            { category: '状态管理', tech: 'JSON 文件持久化任务状态，不接数据库' },
            { category: '速率限制', tech: '简易滑动窗口限流器，默认每分钟 5 次请求' },
            { category: '数据模型', tech: 'Pydantic v2（TaskResponseSchema、TaskItemSchema、TaskSummarySchema）' },
            { category: '包管理', tech: 'pip + requirements.txt' },
            { category: 'CI/CD', tech: 'GitHub Actions（ECS 自动部署，校验 Secrets → rsync 同步 → deploy_on_ecs.sh 远程执行）' },
            { category: '部署', tech: '阿里云 ECS + systemd 进程守护' }
        ]
    },
    {
        id: 'codeview',
        title: 'codeview',
        category: '数据可视化',
        tags: ['React', 'Express', 'ECharts'],
        featured: true,
        order: 5,
        brief: '我的个人 GitHub 数据可视化看板',
        description: '一个面向个人开发者的 GitHub 项目数据可视化产品，将分散的 GitHub 仓库数据同步到本地 SQLite 并沉淀为可持续查看的可视化经营面板。支持仓库列表与基础信息同步持久化、提交记录/语言分布/流量数据采集、活跃度趋势与热力图展示、技术栈标签分析、四维度项目评分、自动洞察卡片生成。前端经 Nginx 反向代理透传 `/api` 到 Express 后端，GitHub Token 加密存储并按配置定时增量同步。',
        repoUrl: 'https://github.com/gouxinjie/codeview',
        deployPath: '/var/www/codeview',
        startMode: 'Docker Compose 编排（server + web + Nginx），GitHub Actions 构建镜像推送到阿里云 ACR 后远程 SSH 触发',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 → 类型校验 → 构建 server/web 镜像 → 推送 ACR → SSH 解压发布包 → Docker Compose pull + up -d，自动保留最近 2 个版本；用户经 Nginx 反代访问 Express 后端',
        port: '内部 server 监听 3101，web（Nginx）监听 80',
        url: 'http://codeview.gouxinjie.com/',
        covers: ['/images/project-cover/codeview.png', '/images/project-cover/codeview-1.png', '/images/project-cover/codeview-2.png', '/images/project-cover/codeview-3.png'],
        techStackBrief: 'Node.js、Express、React、Vite、SQLite、ECharts、GitHub REST API 增量同步',
        techStackDetail: [
            { category: '框架', tech: '前端 React 18 + Vite 6；后端 Express 4（Node.js + TypeScript）' },
            { category: '语言', tech: 'TypeScript 5.8+（前端 ESNext Bundler 解析，后端 CommonJS）' },
            { category: '样式', tech: 'SCSS（sass），BEM 语义化命名，全局变量/混入，禁止全局污染' },
            { category: '图表', tech: 'ECharts 5.6 + echarts-for-react（热力图/柱状/饼图/雷达/趋势线）' },
            { category: '路由', tech: 'react-router-dom 7.6，HashRouter，7 个页面' },
            { category: '状态管理', tech: 'Zustand 5.0（同步状态/仓库选择/错误跨组件共享）' },
            { category: '数据库', tech: 'better-sqlite3 11.8（SQLite，WAL 模式，外键约束，版本化迁移）' },
            { category: '数据校验', tech: 'Zod 3.24（环境变量 + 请求体/参数运行时校验）' },
            { category: '云端数据', tech: 'GitHub REST API（仓库/提交/语言/流量/文件内容）' },
            { category: 'Token 安全', tech: 'AES-256-CBC 加密存储 + CSRF Token 校验' },
            { category: 'CORS', tech: '基于 WEB_ORIGIN 白名单动态校验，兼容 localhost/127.0.0.1' },
            { category: '同步调度', tech: 'setTimeout 精确分钟级定时器（默认 720 分钟），全量/增量双模式' },
            { category: 'API 设计', tech: 'RESTful，统一响应 `{ success, code, message, data }`' },
            { category: '包管理', tech: 'npm workspaces monorepo（server + web 双子包）' },
            { category: 'CI/CD', tech: 'GitHub Actions（push main → typecheck → build → push ACR → SSH 远程 deploy）' },
            { category: '部署', tech: '阿里云 ECS + Docker Compose（双容器，$CODEVIEW_HTTP_PORT 可配宿主机端口）' }
        ]
    },
    {
        id: 'flow-calendar',
        title: 'flow-calendar',
        category: '其他',
        tags: ['Next.js', 'React 19', 'Prisma'],
        featured: false,
        order: 6,
        brief: '以月历为核心的轻量生活记录工具（Web 移动端 H5）',
        description: '一个用来知道"之前做过什么"的记录与回顾工具——不做计划、不设 KPI，只是把已经发生过的生活清晰地留在月历上',
        repoUrl: 'https://github.com/gouxinjie/flow-calendar',
        deployPath: '/var/www/flow-calendar/app（数据文件独立于 ../data/ 持久化）',
        startMode: 'PM2 fork 单进程守护 → Nginx 反代到 127.0.0.1:3400，GitHub Actions 自动构建 rsync 同步',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 Next.js standalone 构建 → rsync 同步 → PM2 热重载（零停机）',
        port: 'Next.js 监听 127.0.0.1:3400，Nginx 反代对外 80',
        url: 'http://flow-calendar.gouxinjie.com',
        covers: ['/images/project-cover/flow-calendar.png', '/images/project-cover/flow-calendar-1.png', '/images/project-cover/flow-calendar-2.png', '/images/project-cover/flow-calendar-3.png'],
        techStackBrief: 'Next.js、React 19、TypeScript、Prisma、SQLite、Tailwind CSS 4、SCSS',
        techStackDetail: [
            { category: '框架', tech: 'Next.js + React 19 + TypeScript' },
            { category: '样式', tech: 'Tailwind CSS 4 + SCSS，视觉关键词：清透/克制/呼吸感/留白' },
            { category: '组件库', tech: 'antd-mobile 5 + Radix UI（Switch） + Phosphor Icons' },
            { category: '状态管理', tech: 'Zustand 5（跨组件共享）+ useState（局部状态）' },
            { category: '数据库', tech: 'Prisma 5 + SQLite（可平滑迁移 PostgreSQL）' },
            { category: '日期处理', tech: 'dayjs + lunar-typescript（农历/节气）' },
            { category: '客户端缓存', tech: 'IndexedDB（最近访问缓存，非主数据源）' },
            { category: '代码质量', tech: 'ESLint 9 + eslint-config-next' },
            { category: '包管理', tech: 'npm' },
            { category: 'CI/CD', tech: 'GitHub Actions（ECS 自动部署，rsync 同步）' },
            { category: '进程守护', tech: 'PM2（fork 单实例，SQLite 不支持多进程写入）' },
            { category: '反向代理', tech: 'Nginx（静态资源缓存 + 安全头 + WebSocket 支持）' },
            { category: '部署', tech: '阿里云 ECS + Gitee 镜像仓库' }
        ]
    },
    {
        id: 'weather-dashboard',
        title: 'weather-dashboard',
        category: '数据可视化',
        tags: ['React', 'ECharts', 'Docker'],
        featured: false,
        order: 7,
        brief: '以单城市天气与环境为核心的可视化大屏（Web 大屏）',
        description: '一个用来"一眼看懂此刻城市天气"的聚合与展示工具——不做预测规划，只是把实时天气、空气质量、灾害预警、趋势与统计清晰地留在同一屏上',
        repoUrl: 'https://github.com/gouxinjie/weather-dashboard',
        deployPath: '/var/www/weather（数据库由 Docker Volume `weather-data` 持久化到容器内 /app/data/）',
        startMode: 'Docker Compose 双容器（frontend + backend）→ 宿主 Nginx 反代到 127.0.0.1:3200，GitHub Actions 自动构建镜像同步',
        status: '正常运行',
        remark: 'GitHub Actions 自动部署，push main 触发 docker build 前端+后端镜像 → scp 上传 → ECS docker load + compose up -d（滚动替换）',
        port: 'frontend 容器 80 → 宿主 3200，backend 仅内网 3201，宿主 Nginx 对外 80',
        url: 'http://weather.gouxinjie.com',
        covers: ['/images/project-cover/weather-dashboard.png'],
        techStackBrief: 'React 18、Vite、TypeScript 前端、ECharts 图表、Node.js、Express、TypeScript 后端、SQLite、Docker Compose 部署',
        techStackDetail: [
            { category: '前端框架', tech: 'React 18 + Vite + TypeScript' },
            { category: '路由', tech: 'React Router 6' },
            { category: '状态管理', tech: 'Zustand 4（跨组件共享）+ useState（局部状态）' },
            { category: '图表', tech: 'ECharts 5' },
            { category: '样式', tech: 'SCSS（语义化 className，BEM 规范）' },
            { category: '后端', tech: 'Node.js + Express 4 + TypeScript' },
            { category: '数据库', tech: 'SQLite（better-sqlite3，WAL 模式）' },
            { category: '数据源', tech: '和风天气 QWeather API（后端集中转发与聚合，前端不直连）' },
            { category: '缓存', tech: '内存缓存 + SQLite 快照兜底（实时天气 10min / 趋势 30min / 预报 60min TTL）' },
            { category: '容器编排', tech: 'Docker + Docker Compose（双容器 bridge 网络）' },
            { category: '反向代理', tech: 'Nginx（宿主 80 分流 + 前端容器 Nginx 反代 /api）' },
            { category: '部署', tech: '阿里云 ECS' },
            { category: 'CI/CD', tech: 'GitHub Actions（镜像构建 + SCP 同步 + compose 滚动更新）' },
            { category: '代码质量', tech: 'ESLint 8 + @typescript-eslint / eslint-plugin-react' },
            { category: '包管理', tech: 'npm' }
        ]
    }
];