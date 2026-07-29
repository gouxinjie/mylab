# ---- 构建阶段 ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .

# 接收构建参数：百度统计站点 ID
# NEXT_PUBLIC_ 前缀变量需在 next build 时注入客户端 bundle，
# 由 CI 的 docker build --build-arg 传入（本地 .env.local 亦可），不可依赖运行时环境变量。
ARG NEXT_PUBLIC_BAIDU_TONGJI_ID
ENV NEXT_PUBLIC_BAIDU_TONGJI_ID=${NEXT_PUBLIC_BAIDU_TONGJI_ID}

# 构建 Next.js 应用
RUN pnpm run build

# ---- 运行阶段 ----
FROM node:20-alpine AS runner

WORKDIR /app

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# standalone 产物不包含运行时 fs 读取的 markdown 源文件，需显式复制，
# 保证任何运行时读取 content 的逻辑（如 generateMetadata 兜底）不会因目录缺失而报错
COPY --from=builder /app/content ./content

USER nextjs

EXPOSE 3500

ENV PORT=3500

# 健康检查：每 30 秒检查 /health 端点，3 次失败视为不健康
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3500/zh || exit 1

CMD ["node", "server.js"]
