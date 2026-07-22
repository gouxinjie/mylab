# ============================================================
# 多阶段构建：Next.js (standalone) 生产镜像
# 适用于阿里云 ECS 部署，配合 docker-compose + Nginx 反代
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
COPY . .
# 限制 Node 旧生代内存上限，缓解小内存 ECS 构建时的 OOM（配合 ECS 交换分区效果更佳）
ENV NODE_OPTIONS=--max-old-space-size=2048
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

USER nextjs

# 服务端口（与 nginx.conf upstream 的 3500 保持一致）
EXPOSE 3500

# standalone server.js 已通过 ENV 配置端口与地址
CMD ["node", "server.js"]
