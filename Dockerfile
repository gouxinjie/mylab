# ============================================================
# 多阶段构建：Next.js (standalone) 生产镜像
# 适用于在 GitHub Actions Runner 上构建并推送至镜像仓库，
# 阿里云 ECS 仅负责 pull 运行，不再于小内存机器上执行 next build。
# ============================================================

# ---------- 阶段一：构建 ----------
FROM node:20-alpine AS builder
WORKDIR /app

# 启用 pnpm（Node 内置 corepack），版本锁定见 package.json 的 packageManager 字段
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# 仅复制依赖清单以最大化利用 Docker 缓存
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# 复制源码并执行生产构建（standalone 模式）
# 构建在 CI Runner（内存充足）进行，无需限制 NODE_OPTIONS。
COPY . .
RUN pnpm build

# ---------- 阶段二：运行 ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# standalone server.js 通过环境变量读取端口与绑定地址（比命令行参数更稳）
ENV PORT=3500
ENV HOSTNAME=0.0.0.0

# 使用非 root 用户运行，降低容器被攻破后的风险
RUN addgroup -S -g 1001 nodejs \
  && adduser -S -u 1001 -G nodejs nextjs

# 复制 standalone 产物（含精简后的 node_modules 与 server.js）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 复制静态资源与公共资源到 standalone 目录内
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 复制运行时需通过 fs 读取的目录（standalone 不会自动追踪，必须显式复制）
# - content/：lib/ai-docs.ts 运行时读取 content/ai/*.md 渲染文档页
# - messages/：next-intl 国际化消息（兜底，避免运行时缺失）
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages

USER nextjs

# 服务端口（与 nginx.conf upstream 的 3500 保持一致）
EXPOSE 3500

# standalone server.js 已通过 ENV 配置端口与地址
CMD ["node", "server.js"]
