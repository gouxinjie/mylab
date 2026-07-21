# 阿里云 ECS 部署方案（Docker）

> 本文档说明如何将本站点（Next.js 14 App Router + next-intl，需 Node 运行时）部署到阿里云 ECS。
> 采用 **Next.js standalone 多阶段镜像 + Nginx 反向代理** 的容器化方案，并配合 GitHub Actions 实现 push 自动部署。
>
> 当前配置：域名 `gouxinjie.com`，**仅使用 HTTP（80）**，代码部署路径 `/var/www/mylab`。
> 代码获取方式：GitHub Actions 在 ECS 上自动 `git clone`（首次）/ `git pull`（后续），无需手动克隆。

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
- **GitHub Actions**：push 到 `master` 后，通过 SSH 登录 ECS，自动克隆/拉取代码并在 ECS 上完成 `docker compose build`，无需人工登录服务器。

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

- 推荐将 `ECS_USERNAME` 设为 **root**（或具备 `/var/www` 写权限的用户），这样 workflow 可自动创建 `/var/www/mylab` 并克隆。
- 若使用普通用户（如 `ecs-user` / `ubuntu`），请先在 ECS 上执行一次：
  ```bash
  sudo mkdir -p /var/www/mylab
  sudo chown -R $USER:$USER /var/www/mylab
  ```
- 执行部署的用户需属于 `docker` 组：`sudo usermod -aG docker $USER`，然后重新登录。

---

## 三、新增文件清单

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 多阶段构建，产出 standalone 运行镜像 |
| `docker-compose.yml` | 编排 `app`(Next.js) + `nginx` 两个服务 |
| `nginx.conf` | Nginx 反代配置（gzip + 代理头，仅 HTTP） |
| `.dockerignore` | 排除 node_modules / .next / 文档等非运行时文件 |
| `.github/workflows/deploy.yml` | push master 自动在 ECS 上克隆/拉取并重建容器 |

> **配置变更说明**：
> - 为启用精简镜像，已在 `next.config.js` 增加 `output: 'standalone'`。该选项不影响本地开发与原有 `pnpm dev` / `pnpm start` 行为。
> - 为锁定依赖版本，已在 `package.json` 增加 `"packageManager": "pnpm@9.15.4"`。请本地使用相同版本（或开启 corepack 自动对齐），否则 `--frozen-lockfile` 会因 lockfile 版本不符失败。

---

## 四、部署步骤

### 步骤 1：准备部署目录（仅首次，root 用户可跳过）

```bash
# 普通用户需要；root 用户 workflow 会自动创建，可跳过
sudo mkdir -p /var/www/mylab
sudo chown -R $USER:$USER /var/www/mylab
```

> 克隆动作由 GitHub Actions 自动完成，**无需手动 `git clone`**。

### 步骤 2：配置 GitHub Deploy Key（用于 ECS 拉取代码）

无论仓库公开或私有，`git clone` 走 SSH 协议都需要一个有效的 GitHub key：

```bash
# 在 ECS 上生成专门用于拉取代码的密钥（无密码）
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

将上面输出的**公钥**添加到 GitHub 仓库 **Settings → Deploy keys**（勾选 Read only）。私钥留在 ECS 默认位置（`~/.ssh/github_deploy`）。
> **注意**：该 key 文件名非默认，SSH 不会自动选用。`deploy.yml` 已通过 `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_deploy ..."` 显式指定，**无需额外配置 `~/.ssh/config`**。

### 步骤 3：确认域名配置

`nginx.conf` 已配置 `server_name gouxinjie.com www.gouxinjie.com;`，无需修改。
如仅使用主域名，可去掉 `www.gouxinjie.com`。

### 步骤 4：推送触发自动部署

```bash
# 本地提交并推送，Actions 会自动在 ECS 上克隆 + 构建 + 启动
git add .
git commit -m "feat: 初始化部署"
git push origin master
```

随后在 GitHub 仓库 **Actions** 标签页查看实时日志。首次会执行 `git clone` 并构建镜像（稍慢），之后为 `git pull` + 增量重建。

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

- **访问 502**：检查 `nginx.conf` 中 `upstream` 的 `app:3500` 与 `Dockerfile` 的 `--port 3500` 是否一致；`docker compose logs app` 排查构建/启动错误。
- **frozen-lockfile 报错**：本地执行 `pnpm install` 生成 `pnpm-lock.yaml` 后提交再 push。
- **域名打不开**：确认安全组已放行 80、DNS A 记录已生效（`ping gouxinjie.com` 看解析 IP）。
- **端口冲突**：宿主机 3500 无需对外开放，仅容器内部使用；确认宿主机 80 未被其他服务占用。
- **/var/www 无写权限**：确认 `ECS_USERNAME` 为 root 或已按步骤 1 赋权。
- **git clone 报权限被拒**：确认 Deploy key 私钥路径为 `~/.ssh/github_deploy`（与 `deploy.yml` 中 `-i` 一致），且公钥已加入仓库 Deploy keys（需 Read only）。
- **docker build 很慢 / 拉取 node 镜像超时**：建议在 ECS 上为 Docker 配置镜像加速器（如阿里云容器镜像服务 ACR 的加速器地址），可显著提升 `node:20-alpine` 基础镜像拉取速度。

---

## 八、GitHub Actions 自动部署

> 目标：本地 push 到 `master` 分支后，自动在 ECS 上拉取最新代码并重建容器，无需手动登录服务器。

### 1. 工作原理

```
git push origin master
      │
      ▼
GitHub Actions Runner (ubuntu)
      │  通过 SSH 登录 ECS
      ▼
ECS: cd /var/www/mylab
     ├─ (无 .git) git clone / (有 .git) git pull origin master
     ├─ docker compose up -d --build
     └─ docker image prune -f
```

### 2. 前置条件

- ECS 已安装 Docker，且执行部署的用户属于 `docker` 组。
- `/var/www/mylab` 目录存在且可写（root 用户自动创建，普通用户见步骤 1）。
- 仓库中已存在 `.github/workflows/deploy.yml`。
- 已配置 GitHub Deploy key（ECS 凭此拉取代码，详见步骤 2）。

### 3. 配置 ECS 登录密钥

在本地生成一对 SSH 密钥（专用于 Actions 登录 ECS）：

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

### 5. 配置 Deploy Key（用于 ECS 拉取代码）

`git clone` / `git pull` 由 ECS 发起且走 SSH，因此 ECS 需具备访问仓库的密钥：

```bash
# 在 ECS 上生成专门用于拉取代码的密钥
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

将输出的**公钥**添加到 GitHub 仓库 **Settings → Deploy keys**（勾选 Read only）。私钥留在 ECS 默认位置即可。

### 6. 使用

```bash
git add .
git commit -m "feat: 更新内容"
git push origin master
```

推送后在 GitHub 仓库 **Actions** 标签页可实时查看部署日志；应用以零停机方式重建（`docker compose up -d` 先起新容器再停旧容器）。

### 7. 常见问题

- **SSH 连接超时**：确认安全组已放行 `22`，且 Secrets 填写正确。
- **Permission denied (publickey)**：登录公钥未加入 ECS `~/.ssh/authorized_keys`；拉代码还需配置 Deploy key。
- **docker: permission denied**：执行部署的用户未加入 `docker` 组，执行 `sudo usermod -aG docker <用户名>` 后重新登录。
- **git clone 失败（GitHub 主机指纹 / 权限）**：workflow 已设置 `StrictHostKeyChecking=accept-new` 自动接受；若仍报权限错，检查 Deploy key 是否添加且为 Read only。
