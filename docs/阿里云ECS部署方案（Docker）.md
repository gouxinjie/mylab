# 阿里云 ECS 部署方案（Docker）

> 本文档说明如何将本站点（Next.js 14 App Router + next-intl，需 Node 运行时）部署到阿里云 ECS。
> 采用 **Next.js standalone 多阶段镜像 + Nginx 反向代理** 的容器化方案，并配合 GitHub Actions 实现 push 自动部署。
>
> 当前配置：域名 `gouxinjie.com`，**仅使用 HTTP（80）**，代码部署路径 `/var/www/mylab`。
> 代码获取方式：GitHub Actions 在 Runner 端 `checkout` 完整代码后，通过 SCP 直接传到 ECS，**ECS 无需访问 GitHub**，也不再需要配置 GitHub Deploy Key。

---

## 一、方案概述

本项目使用 `next-intl` 中间件做国际化路由，**必须在 Node 运行时执行，无法纯静态导出**，因此需要常驻 Node 服务。容器化部署架构如下：

```
浏览器 ──HTTP(80)──▶ Nginx 容器 ──HTTP──▶ Next.js 容器(standalone, 3500)
                        │
                        └─ gzip 压缩 / 反向代理
```

- **Next.js 容器**：基于官方推荐的 `standalone` 输出，镜像仅含运行所需文件，体积小、启动快。
- **Nginx 容器**：对外暴露 80，负责 gzip、反向代理；应用容器仅在 compose 内部网络可达，不直接暴露公网。
- **GitHub Actions**：push 到 `master` 后，Runner 先 `checkout` 完整代码（含 `pnpm-lock.yaml`），通过 SCP 传到 ECS，再在 ECS 上完成 `docker compose build`，无需人工登录服务器、也无需 ECS 访问 GitHub。

> 后续如需启用 HTTPS，只需在 `nginx.conf` 增加 443 server 段、在 `docker-compose.yml` 补充 443 端口与证书挂载即可，应用侧与 workflow 无需改动。

---

## 二、前置条件

### 1. ECS 选型

站点为技术文档/作品集类，流量不大，**2 核 2G / 2 核 4G 即可**（系统盘 40G+）。镜像建议 `Alibaba Cloud Linux 3` 或 `Ubuntu 22.04`。

### 2. 已具备

- Docker 已安装（含 Docker Compose v2，`docker compose` 子命令）。
- 域名 `gouxinjie.com` 已备案。
- GitHub 仓库 Secrets 已配置（见第八节）：`ECS_HOST`、`ECS_USERNAME`、`ECS_SSH_KEY`。

### 3. 关于部署用户与目录

- 推荐将 `ECS_USERNAME` 设为 **root**（或具备 `/var/www` 写权限的用户），这样 workflow 可自动清空并写入 `/var/www/mylab`。
- 若使用普通用户（如 `ecs-user` / `ubuntu`），请先在 ECS 上执行一次：
  ```bash
  sudo mkdir -p /var/www/mylab
  sudo chown -R $USER:$USER /var/www/mylab
  ```
- 执行部署的用户需能运行 `docker`：root 默认可用；普通用户需加入 `docker` 组：`sudo usermod -aG docker $USER`，然后重新登录。

---

## 三、新增文件清单

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 多阶段构建，产出 standalone 运行镜像 |
| `docker-compose.yml` | 编排 `app`(Next.js) + `nginx` 两个服务 |
| `nginx.conf` | Nginx 反代配置（gzip + 代理头，仅 HTTP） |
| `.dockerignore` | 排除 node_modules / .next / 文档等非运行时文件 |
| `.github/workflows/deploy.yml` | push master 自动 checkout + SCP 传代码到 ECS，再重建容器 |

> **配置变更说明**：
> - 为启用精简镜像，已在 `next.config.js` 增加 `output: 'standalone'`。该选项不影响本地开发与原有 `pnpm dev` / `pnpm start` 行为。
> - 为锁定依赖版本，已在 `package.json` 增加 `"packageManager": "pnpm@9.15.4"`。请本地使用相同版本（或开启 corepack 自动对齐），否则 `--frozen-lockfile` 会因 lockfile 版本不符失败。

---

## 四、部署步骤

### 步骤 1：准备部署目录（仅首次，root 用户可跳过）

```bash
# 普通用户需要；root 用户 workflow 的 SCP 步骤会自动 rm + 写入，可跳过
sudo mkdir -p /var/www/mylab
sudo chown -R $USER:$USER /var/www/mylab
```

> 代码传输由 GitHub Actions 自动完成，**无需手动 `git clone`**。

### 步骤 2：代码传输方式说明（无需 Deploy Key）

本方案由 GitHub Actions Runner 在云端 `checkout` 完整代码，再通过 SCP 直接传到 ECS，**ECS 不再需要访问 GitHub**，因此**无需配置 GitHub Deploy Key**。代码（含 `pnpm-lock.yaml`）随传输一并落地到 `/var/www/mylab`，构建必然能拿到锁文件。

### 步骤 3：确认域名配置

`nginx.conf` 已配置 `server_name gouxinjie.com www.gouxinjie.com;`，无需修改。
如仅使用主域名，可去掉 `www.gouxinjie.com`。

### 步骤 4：推送触发自动部署

```bash
# 本地提交并推送，Actions 会自动 SCP 传代码 + 构建 + 启动
git add .
git commit -m "feat: 初始化部署"
git push origin master
```

随后在 GitHub 仓库 **Actions** 标签页查看实时日志。首次会把完整代码 SCP 到 ECS 并构建镜像（稍慢），之后为增量传输 + 重建。

### 步骤 5：放行安全组 & 配置 DNS

- 阿里云控制台 **安全组** 放行入方向：`22`、`80`。
- 域名 `gouxinjie.com` 解析添加 **A 记录** 指向 ECS 公网 IP（如需 www 也可加一条）。

浏览器访问 `http://gouxinjie.com` 即可。

---

## 五、常用运维命令

```bash
# 代码更新：直接 push 即自动部署，无需手动操作
git push origin master

# 如需在 ECS 上手动重建（特殊情况）
cd /var/www/mylab
docker compose up -d --build
docker compose restart app

# 查看实时日志
docker compose logs -f

# 清理悬空镜像（多次构建后释放磁盘）
docker image prune -f
```

---

## 六、后续启用 HTTPS（可选）

1. 阿里云 SSL 控制台申请免费 DV 证书，下载 **Nginx 格式**。
2. 在 `/var/www/mylab/certs` 放置 `fullchain.pem` 与 `privkey.pem`。
3. `docker-compose.yml` 的 nginx 服务补充：
   ```yaml
   ports:
     - "80:80"
     - "443:443"
   volumes:
     - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
     - ./certs:/etc/nginx/certs:ro
   ```
4. `nginx.conf` 增加 443 server 段并将 80 改为跳转 HTTPS，然后 `git push` 触发自动部署（或 `docker compose up -d`）。

---

## 七、常见问题

- **访问 502**：检查 `nginx.conf` 中 `upstream` 的 `app:3500` 与 `Dockerfile`/`docker-compose.yml` 中容器监听的 `3500` 端口是否一致；`docker compose logs app` 排查构建/启动错误。
- **frozen-lockfile 报错**：正常 SCP 方式下 `pnpm-lock.yaml` 会随代码一起传到 ECS；若仍报此错，确认仓库根目录已提交 `pnpm-lock.yaml`（`git ls-files pnpm-lock.yaml` 应有输出）。
- **域名打不开**：确认安全组已放行 80、DNS A 记录已生效（`ping gouxinjie.com` 看解析 IP）。
- **端口冲突**：宿主机 3500 无需对外开放，仅容器内部使用；确认宿主机 80 未被其他服务占用。
- **/var/www 无写权限**：确认 `ECS_USERNAME` 为 root 或已按步骤 1 赋权。
- **docker build 很慢 / 拉取 node 镜像超时**：建议在 ECS 上为 Docker 配置镜像加速器（如阿里云容器镜像服务 ACR 的加速器地址），可显著提升 `node:20-alpine` 基础镜像拉取速度。

---

## 八、GitHub Actions 自动部署

> 目标：本地 push 到 `master` 分支后，自动把代码传到 ECS 并重建容器，无需手动登录服务器。

### 1. 工作原理

```
git push origin master
      │
      ▼
GitHub Actions Runner (ubuntu)
      ├─ checkout 完整代码（含 pnpm-lock.yaml）
      ├─ SCP 把代码传到 ECS:/var/www/mylab
      ▼
ECS: cd /var/www/mylab
     ├─ docker compose up -d --build
     └─ docker image prune -f
```

### 2. 前置条件

- ECS 已安装 Docker（root 默认可用；普通用户需加入 `docker` 组）。
- `/var/www/mylab` 目录可写（root 用户 SCP 自动写入，普通用户见步骤 1）。
- 仓库中已存在 `.github/workflows/deploy.yml`。
- 已配置 ECS 登录 Secrets（见步骤 4），**无需 GitHub Deploy Key**。

### 3. 配置 ECS 登录密钥

在本地生成一对 SSH 密钥（专用于 Actions 登录 ECS，可复用现有登录密钥）：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/ecs_deploy
ssh-copy-id -i ~/.ssh/ecs_deploy.pub <用户名>@<ECS公网IP>
```

### 4. 配置仓库 Secrets

在 GitHub 仓库 **Settings → Secrets and variables → Actions → New repository secret** 中添加：

| Secret 名称 | 内容 | 说明 |
|-------------|------|------|
| `ECS_HOST` | ECS 公网 IP 或域名 | 如 `47.x.x.x` |
| `ECS_USERNAME` | 登录用户名 | 如 `root` / `ecs-user` / `ubuntu` |
| `ECS_SSH_KEY` | 私钥全文 | 上一步生成的 `ecs_deploy` 私钥（含换行，整段粘贴） |
| `ECS_HOST_KEY` | 可选 | `ssh-keyscan <ECS公网IP>` 的输出，用于严格校验主机指纹 |

> 若连接时报 host key 校验失败，补充 `ECS_HOST_KEY` 并在 `deploy.yml` 中取消对应 `host_key` 行注释。

### 5. 使用

```bash
git add .
git commit -m "feat: 更新内容"
git push origin master
```

推送后在 GitHub 仓库 **Actions** 标签页可实时查看部署日志；应用以零停机方式重建（`docker compose up -d` 先起新容器再停旧容器）。

### 6. 常见问题

- **SSH 连接超时**：确认安全组已放行 `22`，且 Secrets 填写正确。
- **Permission denied (publickey)**：登录公钥未加入 ECS `~/.ssh/authorized_keys`。
- **docker: permission denied**：执行部署的用户未加入 `docker` 组，执行 `sudo usermod -aG docker <用户名>` 后重新登录（root 不受影响）。
- **SCP 传输失败 / 目标目录无写权限**：确认 `ECS_USERNAME` 对 `/var/www` 有写权限（root 无此问题）。
- **构建报 frozen-lockfile**：确认仓库根目录已提交 `pnpm-lock.yaml`（SCP 会原样传过去）。
