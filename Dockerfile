# ---- 构建阶段 ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .

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

USER nextjs

EXPOSE 3500

ENV PORT=3500

# 健康检查：每 30 秒检查 /health 端点，3 次失败视为不健康
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3500/zh || exit 1

CMD ["node", "server.js"]
