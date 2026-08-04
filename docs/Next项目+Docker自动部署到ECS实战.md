# 个人技术站点 mylab — 部署运维文档

> **mylab**
> 版本 v1.2 | 2026-08-04
> 运行环境：阿里云 ECS | 部署方式：Docker (standalone) + Nginx + GitHub Actions


## 一、项目背景

### 1.1 项目简介

mylab 是作者的个人技术站点，集 **技术文档、Markdown 文章、国际化与项目作品集** 于一体。站点基于 Next.js 14 App Router，使用 `next-intl` 实现中/英多语言路由；文档内容以 Markdown 编写并运行时渲染（支持代码高亮与 mermaid 流程图）；同时包含作者做过项目的展示页。

站点为需要常驻 Node 运行时的动态应用（国际化中间件在 Node 端执行），**无法纯静态导出**，因此采用 Docker 容器化部署。

### 1.2 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Next.js 14 (App Router) + React 18 + TypeScript |
| 样式 | SCSS (sass) |
| 国际化 | next-intl |
| 内容渲染 | react-markdown + rehype-highlight + rehype-slug + remark-gfm + mermaid + github-slugger + lowlight |
| 构建/包管理 | pnpm 9.15.4（corepack 锁定） |
| 部署 | Docker（standalone 镜像）+ Nginx 反代 + GitHub Actions CI/CD |

### 1.3 项目信息

| 条目 | 内容 |
|------|------|
| 源码仓库 | https://github.com/gouxinjie/mylab |
| 镜像仓库 | crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest（阿里云 ACR 新版个人版） |
| 线上访问 | http://gouxinjie.com |
| ECS 部署路径 | /var/www/mylab |
| 容器数 | 2（app + nginx） |


## 二、部署架构

### 2.1 网络拓扑

整体采用「**宿主 Nginx 反向代理 + Docker Compose 双容器**」方式部署。ECS 的 80 端口由宿主自带的 Nginx 统一监听（该 Nginx 还托管其他站点），本项目不再抢占 80，而是把 Docker Nginx 容器映射到宿主 `3500`，由宿主 Nginx 按 `server_name` 把 `gouxinjie.com` 转发到 `127.0.0.1:3500`。

**请求流向（分层视图）：**

```
┌─────────────────────────────────────────────────────────────────────┐
│  外网用户                                                            │
│  http://gouxinjie.com                                              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│  阿里云 ECS 宿主机                                                   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  宿主 Nginx (:80) — 统一入口（已占用，托管多站点）               │ │
│  │                                                                │ │
│  │  server_name gouxinjie.com                                    │ │
│  │        └── proxy_pass ─────────►  http://127.0.0.1:3500       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Docker Compose ── 默认 bridge 网络                             │ │
│  │                                                                │ │
│  │  ┌─────────────────────┐    ┌─────────────────────────────┐   │ │
│  │  │ nginx (1.27-alpine) │    │ app (next standalone)        │   │ │
│  │  │ 容器:80 ──映射──► :3500  │ 监听 :3500 (仅内网)            │   │ │
│  │  │                     │    │                              │   │ │
│  │  │ upstream app:3500   │    │ server.js (NODE_ENV=prod)    │   │ │
│  │  │   proxy_pass ───────┼───►│ 运行时读取 content/ messages/ │   │ │
│  │  └─────────────────────┘    └─────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**请求链路总结：**

```text
浏览器 ──► ECS:80 (宿主 Nginx)
              │
              └─ gouxinjie.com ──► 127.0.0.1:3500 (nginx 容器, 容器内部 :80)
                                        │
                                        └─ /  ──► app:3500 (Docker DNS, Next.js standalone)
                                                      │
                                                      └─ 渲染页面 / 读取 content/ messages/
```

### 2.2 端口规划

| 端口 | 归属 | 说明 |
|------|------|------|
| 80 | 宿主 Nginx | 对外唯一入口，按域名分流多项目（宿主已占用） |
| 3500 | Docker nginx 容器 | 宿主映射端口，供宿主 Nginx 反代（避让宿主 80 冲突） |
| 3500 | app (Next.js) | 容器内 standalone server 端口，仅 nginx 容器经 compose 网络访问 |

> `app` 容器通过 `expose: ["3500"]` 仅对内暴露，不映射宿主端口；`nginx` 容器 `3500:80` 把宿主 3500 转到容器内的 80。

**⚠️ 关键易混点：本架构中 `3500` 出现了两次，但并非同一个端口直连**

| 出现位置 | 含义 | 使用者 |
|---------|------|--------|
| `app` 的 `expose: "3500"` | Next.js standalone server 在**容器内部**监听的端口 | app 容器内的 Node 进程（仅 Docker 内网可见） |
| `nginx` 的 `ports: "3500:80"` | **宿主机 3500 → nginx 容器内部 80** 的端口映射 | 宿主 Nginx 反代使用的对外入口 |

两者只是恰好同名、纯属顺手；也可设为不同数字（如宿主用 3500、app 用 3000），不影响功能。**两个 3500 之间并不直接相连，中间还隔着 nginx 容器。**

**与两层 Nginx 的交互链路：**

```text
浏览器
  │  http://gouxinjie.com
  ▼
【宿主 Nginx】 :80            ← 统一入口，按域名分流多站点
  │  server_name gouxinjie.com
  │  proxy_pass http://127.0.0.1:3500
  ▼
宿主机端口 :3500
  │  (Docker 端口映射 3500:80)
  ▼
【容器 Nginx】 容器内 :80     ← 反代 + gzip 压缩
  │  nginx.conf: upstream next_app { server app:3500; }
  │  proxy_pass http://next_app
  ▼
app 容器 :3500                ← Next.js standalone server
  │  渲染页面 / 读取 content/、messages/
```

- **宿主 Nginx ↔ 宿主 3500**：宿主 Nginx 在 `:80` 收到 `gouxinjie.com` 请求后，`proxy_pass http://127.0.0.1:3500` 转给本机 3500；Docker 借 `3500:80` 映射把它送进 nginx 容器的 80。
- **容器 Nginx ↔ app 容器 3500**：nginx 容器内 `listen 80`，依据 `nginx.conf` 的 `upstream next_app { server app:3500; }` 反代到 `app:3500`（`app` 为 compose 服务名，由 Docker 内置 DNS 解析），并顺带完成 gzip 与请求头透传。

> 一句话：宿主 3500 是「门牌号」，让宿主 Nginx 找到容器 Nginx；app 的 3500 是「房间号」，让容器 Nginx 找到应用进程；`nginx` 容器的 `3500:80` 映射把门牌号和房间号接起来。

### 2.3 容器与网络

两个容器通过 docker-compose 加入默认 bridge 网络，容器间使用服务名（如 `app`）互访，借助 Docker 内置 DNS 解析。`nginx` 容器内 `nginx.conf` 定义 `upstream next_app { server app:3500; }`，将请求反代到应用容器。`nginx` 通过 `depends_on: app` 保证应用先启动。

应用层为**无状态**部署：构建产物（含 `content/`、`messages/`）随镜像打包，运行时无需外部数据库，容器销毁重建不丢业务数据。

### 2.4 CI/CD 流水线

项目使用 GitHub Actions 自动化部署，工作流文件位于 `.github/workflows/deploy.yml`。触发条件为 push `master` 分支，完整流程：

| # | 阶段 | 操作 |
|---|------|------|
| 1 | 检出 | GitHub Actions Runner 上 `checkout` 完整代码（含 `pnpm-lock.yaml`） |
| 2 | 登录 | 登录阿里云 `ACR`（新版个人版公网域名，使用仓库 Secrets 中的 `ACR_USERNAME` / `ACR_PASSWORD`） |
| 3 | 构建推送 | `docker/build-push-action` 在 Runner 上 `docker build` 并推送 `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest`（启用 gha 缓存加速） |
| 4 | 传运行时文件 | SCP 把 `nginx.conf` + `docker-compose.yml` 上传到 ECS `/var/www/mylab`（`rm: true` 先清空） |
| 5 | 拉起容器 | ECS 端 SSH 执行：`docker login ACR` → `docker compose pull` → `docker compose down \|\| true` → `docker compose up -d` → `docker image prune -f` |

**安全性 / 资源要点：**
- ECS 无需安装 Node.js 或编译工具链 —— 重构建在 GitHub Runner（内存充足）完成，ECS 仅 `docker compose pull` 运行，规避小内存机器（1.8G）`next build` 的 OOM / swap 卡死。
- 镜像存阿里云 ACR（国内仓库），ECS 拉取速度快且稳定，不依赖 GitHub。
- ACR 登录凭据（用户名 / 密码）通过 GitHub Secrets 注入，不进入源码仓库；后续如需密钥，同样通过 GitHub Secrets 注入。

### 2.5 镜像仓库（阿里云 ACR）

#### 2.5.1 ACR 是什么

`ACR`（Alibaba Cloud Container Registry，阿里云容器镜像服务）是阿里云提供的 Docker 镜像存储与分发服务，支持个人版（免费）与企业版。本项目使用 **ACR 新版个人版实例（上海地域）**，镜像地址格式为：

```text
crpi-<实例ID>.cn-<地域>.personal.cr.aliyuncs.com/<命名空间>/<镜像名>:<标签>
```

本项目镜像完整地址为 `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest`（命名空间 `gouxinjie`，仓库 `mylab`，见 1.3 节）。

> **关于地址形式**：ACR 新版个人版实例在不同网络场景有不同域名——公网 `crpi-xxx.cn-shanghai.personal.cr.aliyuncs.com`、专有网络（VPC）`crpi-xxx-vpc.cn-shanghai.personal.cr.aliyuncs.com` 等（`-vpc` 后缀表示 VPC 内网域名，仅阿里云 VPC 内可访问）。GitHub Actions 为海外 Runner，且 ECS 公网拉取同样走公网，因此本项目统一使用**公网域名** `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com`；VPC 地址仅供 ECS 与 ACR 在同一专有网络内时使用，CI 无法访问。

#### 2.5.2 为什么用 ACR

相比 ghcr.io / Docker Hub，这里选阿里云 ACR 的原因：

| 优势 | 说明 |
|------|------|
| 国内拉取快 | ACR 与 ECS 同处国内（上海），`docker pull` 速度快且稳定，避免 ghcr.io 跨境慢速/超时 |
| 免费个人版 | 个人版免费使用，对本项目规模足够，无需额外费用 |
| 阿里云生态 | 与 ECS 同属阿里云，后续可平滑接入 VPC 内网拉取、RAM 子账号授权等能力 |
| 私有化控制 | 仓库默认为私有，需登录才可拉取，凭据经 GitHub Secrets 注入，可控性强 |

#### 2.5.3 本项目中的用法

- **推送（写）**：仅发生在 GitHub Actions Runner 上。工作流用 `ACR_USERNAME` / `ACR_PASSWORD` 登录 `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com` 后，把构建好的镜像打标签 `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest` 并 `push`（见 2.4 节第 3 步）。
- **拉取（读）**：仅发生在 ECS 上。CI 的 SSH 步骤先 `docker login` ACR，再执行 `docker compose pull`。Compose 文件里 `app` 服务 `image: crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest` 即指向该地址，`docker compose up -d` 时自动拉取最新镜像。

> ECS 侧拉取 ACR **需要登录**（仓库为私有）：CI 的 SSH 脚本通过 `docker login --username "$ACR_USERNAME" --password-stdin crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com` 注入凭据（值来自 GitHub Secrets），之后 `docker compose pull` 即可拉取私有镜像。登录状态在 ECS 本地 Docker 有缓存，但每次部署仍重新登录以保证凭据新鲜。

#### 2.5.4 镜像标签与回滚

当前固定使用 `latest` 标签（每次 CI 构建覆盖）。因此：

- ACR 上**只保留最新**一份 `latest` 镜像，不自动留存历史版本（个人版空间有限，需留意清理）；
- 回滚靠重新构建旧代码（见 5.4 节），而非切换 ACR 上的旧标签；
- 如需保留历史版本，可在 `build-push` 步骤追加语义化标签（如 `crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:v1.0.3` + `latest`），再在 `docker-compose.yml` 中显式指定版本号回滚。

## 三、部署遇到的问题与解决

本章记录从首次部署到稳定运行过程中遇到的 5 个关键问题及排查修复过程，按时间顺序整理。

### 3.1 问题一：构建失败 —— `github-slugger` 缺少类型声明

#### 3.1.1 现象

`docker build` 中 `RUN pnpm build`（即 `next build`）失败，`exit code 1`，报错指向 `import BananaSlug from "github-slugger"`，提示 `Could not find a declaration file for module 'github-slugger'`。

#### 3.1.2 排查

`github-slugger@1.5.0` 既无内置 `.d.ts`，社区也没有 `@types/github-slugger` 包。而 `tsconfig.json` 开启 `strict` 且 `next build` 会做全量类型检查，于是报缺类型声明。

不能直接 `pnpm add -D @types/github-slugger`：Docker 构建使用 `--frozen-lockfile`，新增依赖会修改 `pnpm-lock.yaml`，反而导致 lockfile 校验失败。

#### 3.1.3 解决方案

在仓库新增本地环境声明 `types/github-slugger.d.ts`，声明默认导出类 `GithubSlugger`，提供 `slug()` 与 `reset()` 方法。不引入新依赖、不改动 lockfile：

```ts
// types/github-slugger.d.ts
declare module 'github-slugger' {
  export default class GithubSlugger {
    slug(value: string, maintainCase?: boolean): string;
    reset(): void;
  }
}
```

提交：`7550c2a`。

### 3.2 问题二：构建失败 —— `react-markdown` 的 `_node` 属性类型错误

#### 3.2.1 现象

修复上一条后重新构建，又报：

```
./components/commons/Markdown/index.tsx:78:7
Type error: Property '_node' does not exist on type ...
```

同时有 ESLint 警告（`ImageZoom`/`Lightbox` 的 `src` 未使用、`@next/next/no-img-element`，均为 Warning，不阻断构建）。

#### 3.2.2 排查

`react-markdown` v10 在向自定义组件 props 注入 AST 节点时，属性名是 `node`（不是 `_node`）。原代码写成 `a({ _node, href, children, ...rest })` 与原类型不匹配，触发类型错误。

#### 3.2.3 解决方案

改为 `node: _node` 重命名解构 —— 以 `node` 匹配 react-markdown 真实属性名满足类型检查，同时用 `_node` 别名前缀满足 ESLint `no-unused-vars`（未使用变量须以 `_` 开头）规则：

```tsx
a({ node: _node, href, children, ...rest }) {
  // ...
}
```

提交：`8bc3a23`。

### 3.3 问题三：部署失败 —— 80 端口 `address already in use`（误判）

#### 3.3.1 现象

CI 通过 `appleboy/ssh-action` 在 ECS 上执行 `docker compose up -d` 时，`mylab-nginx-1` 启动失败：

```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
Process exited with status 1
```

#### 3.3.2 错误尝试

最初以为冲突来自本项目旧容器，于是在 `deploy.yml` 的 SSH 脚本 `up -d` 前加了 `docker compose down || true`，意图先停旧容器释放 80。提交：`6c84b4a`。

但 `docker compose down` 只能停掉 compose 管理的容器，**释放不了宿主机本身**占用 80 的服务，因此该处理对真实根因无效（保留无害）。

### 3.4 问题四：部署失败 —— 宿主机裸 Nginx 占用 80（真实根因）

#### 3.4.1 根因分析

经用户反馈澄清：80 端口是被 **ECS 宿主机自带的 `nginx`** 占用（该 Nginx 托管其他站点），并非本项目容器。这与多项目共享 ECS 的场景一致 —— 不能靠 `docker compose down` 去释放宿主服务，否则会影响其他站点。

#### 3.4.2 解决方案

将 Docker Nginx 容器的宿主机映射从 `80:80` 改为 `8080:80`，由宿主 Nginx 把 80 转发到 `127.0.0.1:8080`。提交：`24aa204`。

随后用户要求不使用 8080、改用 `3500`，于是将 `docker-compose.yml` 的 nginx 服务 `ports` 改为 `"3500:80"`，并同步把宿主转发目标改为 `127.0.0.1:3500`。提交：`62d88ef`。

最终 `docker-compose.yml` 关键片段：

```yaml
services:
  app:
    image: crpi-5ue84w8rjgqxg0s0.cn-shanghai.personal.cr.aliyuncs.com/gouxinjie/mylab:latest
    restart: unless-stopped
    expose:
      - "3500"            # 仅对内暴露，不映射宿主端口
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "3500:80"         # 容器内 80 → 宿主 3500（避让宿主 80）
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
```

#### 3.4.3 回归修复：nginx 端口配置回退

在后续排障迭代中，`docker-compose.yml` 的 nginx 端口曾被误写成 `"80:80"` 与 `"3500:3500"`，导致：
- `80:80` 与宿主 Nginx 抢占，报 `bind: address already in use`
- `3500:3500` 无意义（容器内 Nginx 仅 `listen 80`，不监听 3500）

修复为恢复原先的 `"3500:80"`。提交：`df4ba22`。

### 3.5 问题五：宿主机 Nginx 转发配置未随 SCP 传输

#### 3.5.1 现象

尝试在仓库维护宿主机 Nginx 转发配置 `deploy/host-nginx/serve_mylab.conf`，并在 ECS 上 `cp /var/www/mylab/deploy/host-nginx/serve_mylab.conf /etc/nginx/conf.d/`，报错：

```
cp: cannot stat '/var/www/mylab/deploy/host-nginx/serve_mylab.conf': No such file or directory
```

#### 3.5.2 根因分析

CI 的 SCP 步骤 `source` 仅指定 `nginx.conf,docker-compose.yml`，**不传输 `deploy/` 目录**（见 2.4 节第 4 步）。因此 `deploy/` 下的配置永远不会出现在 ECS 上，手动 `cp` 必然失败。

#### 3.5.3 解决方案

删除仓库中的 `serve_mylab.conf`（提交：`da297dd`），改为在 **ECS 上手动创建** 宿主机 Nginx 配置 `/etc/nginx/conf.d/serve_mylab.conf`（内容见 4.5 节）。原因：

- `docker compose pull` / `docker compose up -d` 由 CI 每次 push 后**自动执行**，无需手动登录 ECS 操作容器。
- 宿主机 Nginx **不在 compose 管理范围内**，CI 碰不到它，因此转发配置必须手动维护（SSH 登录 `nginx -s reload`）。

### 3.6 排障小结

| 阶段 | 问题 | 解决 | 提交 |
|------|------|------|------|
| 构建 | `github-slugger` 缺类型声明 | 本地 `.d.ts` 声明 | `7550c2a` |
| 构建 | `react-markdown` 的 `_node` 类型错误 | 改用 `node: _node` 重命名解构 | `8bc3a23` |
| 部署（误判） | 80 端口被旧容器占用 | `docker compose down`（无效，保留无害） | `6c84b4a` |
| 部署（根因） | 宿主机裸 nginx 占用 80 | 容器改映射 `8080:80` → `3500:80` + 宿主转发 | `24aa204` / `62d88ef` |
| 部署 | `deploy/` 未随 SCP 传输，ECS 缺转发配置 | 删除仓库配置，改为 ECS 手动创建 | `da297dd` |
| 部署 | nginx 端口回退（误写成 `80:80`） | 修正为 `3500:80` | `df4ba22` |
| 部署 | app 容器 unhealthy（Next.js 监听主机名） | `command` 强制 `HOSTNAME=0.0.0.0`，覆盖 healthcheck 探针 | `35c6e43` |
| 部署 | nginx 容器静态资源 404（alias 跨容器无效） | `alias` 改为 `proxy_pass http://app:3500`，加 `^~` 前缀优先 | `db36cab` |
| 运行时 | GitHub API 401（ECS 缺 GITHUB_TOKEN） | REST 接口兼容无 Token，CI 通过 `export` 注入 `GH_TOKEN` | `d657aa3` |

### 3.7 问题六：app 容器 unhealthy 导致 nginx 启动失败

#### 3.7.1 现象

`docker compose up -d` 后 nginx 容器反复 restart，日志显示 `dependency failed to start: container mylab is unhealthy`。同时 podman / docker exec 进 app 容器执行 `wget localhost:3500` 报 `Connection refused`。

#### 3.7.2 根因分析

Next.js 14 standalone 模式的 `server.js` 默认监听 `process.env.HOSTNAME`。Docker 容器启动时，`HOSTNAME` 被设为容器 ID（如 `729b4e27a769`）而非 `0.0.0.0`，导致 `server.js` 只监听该主机名对应的内部地址，`localhost` 或 `127.0.0.1` 的请求被拒绝。

同时 Nginx 容器的 `depends_on` 使用了 `condition: service_healthy`，app 的 healthcheck 探针 `wget http://localhost:3500/zh` 永远失败，nginx 无法启动。

#### 3.7.3 解决方案

在 `docker-compose.yml` 的 app 服务中添加 `command`，强制覆盖 `HOSTNAME` 为 `0.0.0.0`：

```yaml
app:
  command: sh -c "cd /app && HOSTNAME=0.0.0.0 exec node server.js"
```

同时将 healthcheck 探针从 `--spider`（HEAD 请求，Next.js 可能拒绝）改为真实 GET：

```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://localhost:3500/zh"]
```

提交：`35c6e43`。

### 3.8 问题七：nginx 容器静态资源全部 404

#### 3.8.1 现象

页面可访问，但所有 `/_next/static/` 下的 CSS、JS、字体文件（woff2）全部返回 404，页面样式完全丢失。

#### 3.8.2 根因分析

`nginx.conf` 中对 `/_next/static/` 等路径使用了 `alias /app/.next/static/`。Docker Compose 中 nginx 和 app 是两个独立容器，**文件系统相互隔离**——`/app/.next/static/` 只存在于 app 容器内，nginx 容器中没有这个目录，`alias` 指向的路径根本不存在任何文件，因此返回 404。

此外，nginx 匹配规则中正则 `location ~* \.(woff2|woff|ttf)$` 优先级高于普通前缀匹配，导致字体文件被正则 location 捕获，而该正则 location 也没有有效的文件来源。

#### 3.8.3 解决方案

将所有静态资源 location 从 `alias`（本地文件）改为 `proxy_pass http://app:3500`（代理到 app 容器由 Next.js standalone 服务），并为前缀匹配 location 添加 `^~` 修饰符阻止正则匹配覆盖：

```nginx
location ^~ /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    proxy_pass http://app:3500;
}

location ^~ /images/ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, must-revalidate" always;
    proxy_pass http://app:3500;
}
# ... 其他静态路径同理
```

提交：`db36cab`。

### 3.9 问题八：GitHub API 线上 401（ECS 缺 GITHUB_TOKEN）

#### 3.9.1 现象

本地开发正常，但线上 GitHub Dashboard 组件的贡献热力图显示"贡献数据加载失败，请稍后重试"，同时统计卡片的兜底值也未正确渲染。控制台 Network 面板显示 `/api/github/user`、`/api/github/repos`、`/api/github/contributions` 均返回 401。

#### 3.9.2 根因分析

三个 API route 均需要 `process.env.GITHUB_TOKEN`。`docker-compose.yml` 中配置为 `GITHUB_TOKEN=${GITHUB_TOKEN:-}`，即从宿主机环境变量读取。ECS 宿主机未设置该变量，容器内拿到空字符串，向 GitHub API 发送 `Authorization: Bearer `（空 token）导致 401。

#### 3.9.3 解决方案

**两层面修复：**

**API 层兼容无 Token（代码防御）：**
- `user` 和 `repos` 接口（GitHub REST API）：读取公开数据不需要 Token，仅当 Token 存在时才添加 `Authorization` header，否则正常发起未认证请求（rate limit 降为 60 req/h，对个人站点足够）。
- `contributions` 接口（GitHub GraphQL API）：GraphQL **必须认证**，Token 为空时返回中文友好错误 `"环境变量 GITHUB_TOKEN 未配置，无法获取贡献数据"`，前端正常进入 `contributionsError` 兜底状态。

**部署层注入 Token（CI 修复）：**
- 在 GitHub Actions → Repository secrets 中添加 `GH_TOKEN`（值为 GitHub Personal Access Token）。
- `deploy.yml` 中 SSH 部署时通过 `export GITHUB_TOKEN="${{ secrets.GH_TOKEN }}"` 注入，`docker compose` 的 `${GITHUB_TOKEN:-}` 从 shell 环境变量读取到真实值。

提交：`d657aa3`。

**注意：** Secret 名称不能用 `GITHUB_` 前缀（GitHub 保留字），故使用 `GH_TOKEN`。


## 四、关键配置文件说明

### 4.1 Dockerfile（standalone 多阶段镜像）

**位置**：项目根路径

阶段一 `builder`：启用 corepack 锁定 pnpm 9.15.4 → `pnpm install --frozen-lockfile` → `pnpm build`（产出 `.next/standalone`）。阶段二 `runner`：复制 standalone 产物、`public`、`content/`、`messages/`，以非 root 用户 `nextjs` 运行 `node server.js`，`PORT=3500`。

关键点：`content/` 与 `messages/` 需显式 `COPY`（standalone 不会自动追踪运行时经 `fs` 读取的目录），否则文档页/国际化会缺失。

### 4.2 docker-compose.yml（Docker 编排核心）

定义 `app`（应用镜像，来自阿里云 ACR）与 `nginx`（反代）两个服务。`app` 仅 `expose` 对内；`nginx` 映射 `3500:80` 并挂载 `nginx.conf`。生产启动由 CI 自动执行 `docker login ACR && docker compose pull && up -d`。

关键配置要点：

- **`command` 覆盖**：`HOSTNAME=0.0.0.0 exec node server.js`，解决 Next.js standalone 默认监听容器 ID 导致 healthcheck 失败的问题（见 3.7 节）。
- **healthcheck**：`wget -q -O /dev/null http://localhost:3500/zh`（真实 GET，避免 `--spider` HEAD 被拒绝）。
- **`depends_on: service_healthy`**：nginx 须等待 app 通过健康检查后才启动，防止启动时序问题。
- **`restart: always`**：app 容器崩溃自动重启。
- **`GITHUB_TOKEN=${GITHUB_TOKEN:-}`**：从 shell 环境变量（CI 中由 `export` 注入）读取 GitHub Token，不存在时为空。目前仅 contributions GraphQL 强制要求，user / repos REST 接口无 Token 仍可工作。
- **`--remove-orphans`**：CI 每次部署前执行 `docker compose down --remove-orphans || true`，清理因容器改名留下的孤儿容器，避免端口被旧容器占用。

### 4.3 nginx.conf（容器内 Nginx 反代配置）

**挂载位置**：容器内 `/etc/nginx/nginx.conf`（只读，完整主配置含 `events` + `http` 块）

关键规则：
- `listen 80`（容器内 Nginx 监听 80 端口，由 docker compose 映射到宿主 3500）
- Gzip 压缩已开启（comp_level 6）
- `location /` 反代到 `http://app:3500`，透传 `Host` / `X-Real-IP` / `X-Forwarded-*` 头，并支持 WebSocket（`Upgrade` / `Connection` 头）

**静态资源处理（重要）**：

由于 nginx 与 app 是两个独立容器，文件系统隔离，`/_next/static/` 等静态文件**不存在于 nginx 容器内**，不能使用 `alias` 或 `root` 直接读取。所有静态资源 location 均使用 `proxy_pass http://app:3500` 交由 Next.js standalone 服务，并在前缀匹配上添加 `^~` 阻止正则 location 覆盖（详见 3.8 节）。

该文件由 CI 的 SCP 步骤传输，属于受管文件。

### 4.4 .github/workflows/deploy.yml（CI/CD 工作流）

push `master` 触发：Runner 端 checkout → 登录阿里云 ACR → build-push 镜像 → SCP 传 `nginx.conf`+`docker-compose.yml` → ECS 端 `docker login ACR` + `export GITHUB_TOKEN`（注入 GitHub API Token）→ `docker compose pull && up -d --remove-orphans`。所用 Secrets：`ECS_HOST`、`ECS_USERNAME`、`ECS_SSH_KEY`、`ACR_USERNAME`、`ACR_PASSWORD`、`GH_TOKEN`（可选 `ECS_HOST_KEY` 做严格主机指纹校验）。

### 4.5 宿主 Nginx 配置（手动维护）

**位置**：ECS 的 `/etc/nginx/conf.d/serve_mylab.conf`（**不在项目源码中管理**）

负责将 `gouxinjie.com` 流量转发到 `127.0.0.1:3500`。该配置需首次部署时手动创建，后续变更需 SSH 登录执行 `nginx -s reload`：

```nginx
server {
    listen 80;
    server_name gouxinjie.com www.gouxinjie.com;

    access_log /var/log/nginx/gouxinjie.access.log;
    error_log  /var/log/nginx/gouxinjie.error.log;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3500;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }
}
```

> 注意：若宿主 Nginx 主配置中存在 `default_server` 且 `root` 指向其他站点，未配置 `server_name gouxinjie.com` 时请求会被 `default_server` 捕获而显示错误站点。新增本配置后 Nginx 按域名最长匹配优先路由。

### 4.6 types/github-slugger.d.ts（类型补丁）

为无类型声明的 `github-slugger` 提供本地模块声明（见 3.1 节），保证 `next build` 严格类型检查通过。


## 五、运维指南

### 5.1 日常命令

| 操作 | 命令 |
|------|------|
| 代码更新（触发自动部署） | `git push origin master` |
| 查看容器状态 | `cd /var/www/mylab && docker compose ps` |
| 查看应用日志 | `docker compose logs app --tail 50` |
| 查看 Nginx 日志 | `docker compose logs nginx --tail 50` |
| 重启服务 | `docker compose restart` |
| 清理旧镜像（释放磁盘） | `docker image prune -f` |
| 宿主 Nginx 重载配置 | `sudo nginx -t && sudo nginx -s reload` |

> 容器层的 `pull`/`up -d` 由 CI 自动完成；日常无需手动执行 `docker compose up -d`，除非紧急在 ECS 本地调试。

### 5.2 健康检查验证

部署完成后，通过以下方式验证服务正常：

1. 检查容器状态，nginx 应映射 `0.0.0.0:3500->80/tcp` 且状态 `Up`：

   ```bash
   docker compose ps
   ```

2. 应用 standalone server 可访问（容器内 3500）：

   ```bash
   curl -I http://127.0.0.1:3500/
   # => HTTP/1.1 200 OK
   ```

3. 经 Docker Nginx 容器（宿主 3500）：

   ```bash
   curl -I http://127.0.0.1:3500/
   # => HTTP/1.1 200 OK
   ```

4. 经宿主 Nginx 域名链路：

   ```bash
   curl -I http://gouxinjie.com/
   # => HTTP/1.1 200 OK
   ```

### 5.3 无状态部署说明

本应用为无状态部署：业务内容（`content/`、`messages/`）随镜像打包，运行时无需外部数据库，容器销毁重建不丢数据。因此**无需数据库备份**。若需保留运行时上传的静态资源，应在 `docker-compose.yml` 中挂载 Volume（当前版本未涉及）。

### 5.4 紧急回滚

如果新版本部署后出现问题，可手动切换到上一个版本：

1. 在 GitHub Actions 找到最近一次成功的 workflow run；
2. revert 问题代码后重新 `git push master`，或触发该 workflow 的 re-run；
3. GitHub Actions 自动执行 build + deploy，覆盖当前容器。

注意：Docker 镜像为每次构建产生的 `latest` 标签，ECS 上不保留历史镜像，因此回滚实际上是通过重新构建旧版本实现的。

### 5.5 封面图与静态图片更新规范

#### 5.5.1 问题背景

站点项目封面图放在 `public/images/project-cover/`，通过 `next/image` 组件优化展示。`next/image` 对 `public/` 下静态图片的优化 URL 形如：

```
/_next/image?url=/images/project-cover/prompt.png&w=384&q=95
```

该 URL **不包含图片内容哈希**，只由「路径 + 尺寸 + 质量」决定。因此**即使替换了 `prompt.png` 的源文件，优化 URL 也完全不变**，浏览器与 CDN 会持续命中旧缓存，导致生产环境「换了图但界面还是旧图」。

#### 5.5.2 规范：换图必须重命名文件

**凡是更新 `public/images/` 下的静态图片，必须重命名文件（或改文件名使其变化），并同步更新引用。** 严禁原地覆盖同名文件。

正确做法示例（假设 `prompt.png` 要更新到 v3）：

```bash
# 1. 在项目中重命名（推荐用 git mv 保留历史）
git mv public/images/project-cover/prompt-v2.png public/images/project-cover/prompt-v3.png

# 2. 同步更新 lib/projects.ts 中的引用
```

```ts
// lib/projects.ts —— 更新后
covers: [
  '/images/project-cover/prompt-v3.png',
  '/images/project-cover/prompt-1-v3.png',
  '/images/project-cover/prompt-2-v3.png',
  '/images/project-cover/prompt-3-v3.png',
],
```

#### 5.5.3 相关缓存配置（勿随意改动）

- `nginx.conf` 中 `location ^~ /images/`：`expires 30d`（30 天强缓存）。
- `next.config.js` 中 `/images/(.*)`：`Cache-Control: public, max-age=86400, must-revalidate`（1 天）。

这两处强缓存决定了必须用「文件名变化」来强制失效。若把强缓存改为协商缓存（`no-cache`），则换图可免重命名，但每次访问都会向后端校验，性能略降。当前项目采用重命名方案，保持强缓存以提升访问性能。

#### 5.5.4 排查 Checklist

遇到「换了图但线上不更新」时按序检查：

1. 是否重命名了文件（而不是原地覆盖）？→ 未重命名则必然命中旧缓存。
2. 是否同步更新了 `lib/projects.ts` 的引用路径？
3. 浏览器是否仍缓存旧 URL？→ 可强制刷新（Ctrl+F5）或在新无痕窗口验证。
4. 部署是否完成？→ 确认 GitHub Actions 部署成功、容器已重建。


## 六、附录

### 6.1 首次部署 Checklist

以下清单适用于在新 ECS 上从零部署：

**GitHub Actions Secrets 配置：**

| Secret 名称 | 描述 | 示例值 |
|---|---|---|
| `ECS_HOST` | ECS 服务器公网 IP 或域名，部署目标地址 | `47.xx.xx.xx` |
| `ECS_USERNAME` | ECS 服务器 SSH 登录用户名 | `root` |
| `ECS_SSH_KEY` | ECS 服务器 SSH 私钥全文，用于 GitHub Actions 免密登录 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `ECS_HOST_KEY` | 可选，主机指纹，用于严格校验（首次连接报 host key 失败时配置） | `ssh-keyscan <ECS公网IP>` 输出 |
| `ACR_USERNAME` | 阿里云 ACR 登录用户名（新版个人版为阿里云账号全名），用于 CI 推送与 ECS 拉取 | `aliyun4356291210` |
| `ACR_PASSWORD` | ACR 容器镜像服务「访问凭证」中设置的独立固定密码（非阿里云账号密码） | `xxxxx` |
| `GH_TOKEN` | GitHub Personal Access Token，注入容器供 contributions API 使用（名称不能以 `GITHUB_` 开头） | `ghp_xxxxxxxxxxxx` |

**ACR 前置准备（首次部署前）：**
- 在阿里云「容器镜像服务 → 访问凭证」设置独立固定密码（非阿里云账号密码）。
- 确认实例为**新版个人版**（域名含 `personal.cr.aliyuncs.com`），登录用户名为阿里云账号全名。
- 创建命名空间 `gouxinjie` 与镜像仓库 `mylab`（或开启「自动创建仓库」）。
- 将 ACR 登录用户名与密码分别填入 GitHub Secrets 的 `ACR_USERNAME` / `ACR_PASSWORD`。

配置路径：GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

**其余步骤：**

- 安装 Docker Engine 和 Docker Compose v2
- 创建 `/var/www/mylab` 目录
- 配置以上 GitHub Actions Secrets
- 在 ECS 宿主添加 `/etc/nginx/conf.d/serve_mylab.conf`（见 4.5 节）并执行 `nginx -s reload`
- DNS 将 `gouxinjie.com` / `www.gouxinjie.com` 解析到 ECS IP
- 阿里云安全组放行入方向 `22`、`80`
- 触发一次 push 或 GitHub Actions 手动构建
- 确认 `docker compose ps` 两个容器状态均为 Up（nginx 映射 `3500->80`）
- 浏览器访问 `http://gouxinjie.com` 确认页面正常

### 6.2 本地开发说明

- 本地开发：`pnpm install && pnpm dev`（监听 3500）。
- 构建校验：`pnpm build` 会做严格类型检查（含 `types/*.d.ts`），提交前务必本地通过，避免 CI 构建失败。
- 包管理器锁定为 `pnpm@9.15.4`（`package.json` 的 `packageManager` 字段），本地开启 corepack 可自动对齐版本，否则 `--frozen-lockfile` 会因 lockfile 版本不符失败。

### 6.3 项目仓库结构

```
mylab/
├── .github/workflows/deploy.yml   # CI/CD 工作流
├── Dockerfile                     # standalone 多阶段镜像
├── docker-compose.yml             # 双容器编排（app + nginx）
├── nginx.conf                     # 容器内 Nginx 反代配置
├── next.config.js                 # output: 'standalone'
├── package.json                   # packageManager: pnpm@9.15.4
├── types/
│   └── github-slugger.d.ts        # 类型补丁
├── app/ components/ styles/       # 前端源码
├── content/                       # Markdown 文档源（运行时读取）
├── messages/                      # next-intl 国际化消息
└── README.md
```

### 6.4 参考链接

- Next.js standalone 部署：https://nextjs.org/docs/app/building-your-application/deploying#docker-image
- Docker Compose 文档：https://docs.docker.com/compose/
- Nginx 反向代理指南：https://nginx.org/en/docs/http/ngx_http_proxy_module.html
- GitHub Actions 文档：https://docs.github.com/actions

> — 文档结束 —
