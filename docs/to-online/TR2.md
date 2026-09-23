# TR2 - 技术选型：Control Universe Wiki 上线

> 版本：v1.0 | 日期：2026-09-22 | 状态：待评审
> 前置文档：[TR1 - 需求拆解](./TR1.md)

## 1. 选型总览

| 领域 | 选型 | 版本/规格 | 理由 |
|------|------|----------|------|
| 云服务器 | 阿里云 ECS（计算型） | 2C4G / 40GB SSD / 3Mbps 带宽 | 满足 100 访问/小时 + Jupyter 计算需求 |
| 操作系统 | Ubuntu 22.04 LTS | 64-bit | 社区支持好，Docker 兼容性强 |
| 容器引擎 | Docker Engine + Compose v2 | Docker 24+, Compose v2.20+ | 标准方案，文档丰富 |
| Next.js 运行时 | Node.js 20 LTS (Alpine) | 20.x | 与项目 package.json 兼容，长期支持 |
| Python 运行时 | Python 3.11 (Slim) | 3.11.x | scipy/control 兼容性好，镜像较小 |
| 反向代理 | Nginx | 1.25 (mainline-alpine) | 轻量、稳定、Alpine 镜像小 |
| 容器镜像仓库 | 阿里云 ACR（个人版） | 免费 | 境内拉取快，CI/CD 友好 |
| CI/CD | GitHub Actions | - | 免费额度足够，推送到 ACR |
| 访问统计 | Umami（自托管） | 2.x | 隐私友好、轻量、可 Docker 部署 |
| 进程管理 | Docker restart policy | - | 无需额外 PM2/supervisor |

---

## 2. 云服务器选型

### 2.1 规格选择

| 配置项 | 选择 | 说明 |
|--------|------|------|
| 实例规格 | ecs.c6.large（计算型） | 2 vCPU / 4 GiB |
| 系统盘 | 40GB ESSD Entry | 够用，可后续扩容 |
| 数据盘 | 不需要（初期） | 日志用 Docker volume，内容在 Git |
| 带宽 | 3 Mbps 按固定带宽 | 100 访问/小时足够，页面 < 1MB |
| 地域 | 华东1（杭州）/ 华东2（上海） | 大陆用户访问快 |
| 计费 | 包年包月（推荐）或按量 | 包年更划算，约 ¥100-200/月 |

### 2.2 预估成本

| 项目 | 月费用（估） |
|------|-------------|
| ECS 2C4G | ¥100-200 |
| 带宽 3Mbps | 含在实例费用中 |
| 系统盘 40GB | 含在实例费用中 |
| ACR 个人版 | 免费 |
| GitHub Actions | 免费（2000 分钟/月） |
| **合计** | **¥100-200/月** |

### 2.3 备选方案

| 方案 | 规格 | 月费 | 说明 |
|------|------|------|------|
| 轻量应用服务器 | 2C2G | ¥50-80 | 更便宜但内存小，Jupyter 可能吃紧 |
| ecs.c6.xlarge | 4C8G | ¥300-400 | 如果后续流量增长 |

**建议**：先用 2C4G，监控资源使用情况，不够再升配。

---

## 3. 操作系统选型

| 选项 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| Ubuntu 22.04 LTS | 社区最大、Docker 官方支持好、5 年 LTS | - | **选择** |
| Alibaba Cloud Linux 3 | 阿里云优化、内核调优 | 社区小、遇到问题搜不到 | 备选 |
| CentOS 7/8 | 传统选择 | EOL / 停止维护 | 不推荐 |
| Debian 12 | 稳定 | Docker 支持略逊于 Ubuntu | 备选 |

**选择**：Ubuntu 22.04 LTS Server

---

## 4. 容器技术选型

### 4.1 Docker 版本

| 组件 | 版本 | 说明 |
|------|------|------|
| Docker Engine | 24.0+ | 稳定版，支持 Compose v2 |
| Docker Compose | v2.20+ | 作为 Docker CLI 插件（`docker compose`） |

安装方式：使用 Docker 官方 `install.sh` 脚本，配置阿里云镜像加速。

### 4.2 基础镜像选择

#### Next.js 容器

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
# 运行阶段
FROM node:20-alpine AS runner
```

| 选项 | 镜像大小 | 说明 |
|------|---------|------|
| node:20-alpine | ~180MB | **选择**，最小化 |
| node:20-slim | ~200MB | 略大，glibc 兼容性好 |
| node:20 | ~1GB | 太大 |

**选择**：`node:20-alpine`，配合 `next build --standalone` 输出。

#### Jupyter 容器

```dockerfile
FROM python:3.11-slim AS base
```

| 选项 | 镜像大小 | 说明 |
|------|---------|------|
| python:3.11-alpine | ~50MB 基础 | Alpine 编译 scipy 困难 |
| python:3.11-slim | ~150MB 基础 | **选择**，scipy 兼容 |
| python:3.11 | ~900MB 基础 | 太大 |

**选择**：`python:3.11-slim`。scipy/numpy 在 Alpine 上需要大量编译，slim 版有预编译 wheel。

#### Nginx 容器

```dockerfile
FROM nginx:1.25-alpine
```

**选择**：`nginx:1.25-alpine`，~40MB。

### 4.3 Docker Compose 架构

```yaml
services:
  next:       # Next.js 应用
  jupyter:    # Python Kernel 服务
  nginx:      # 反向代理
  umami:      # 访问统计（可选）
  umami-db:   # Umami PostgreSQL（可选）
```

网络拓扑：
```
[公网] → :80 → [nginx]
                  ├── /              → [next:8080]
                  ├── /api/notebook  → [jupyter:8891] (内网)
                  └── /umami         → [umami:3000] (内网)
```

---

## 5. CI/CD 流水线选型

### 5.1 方案设计

```
[开发者] → git push → [GitHub Actions]
                          ├── 构建 Docker 镜像
                          ├── 推送到阿里云 ACR
                          └── SSH 触发服务器部署
                                ├── docker pull
                                └── docker compose up -d
```

### 5.2 镜像仓库

| 选项 | 境内速度 | 免费额度 | 说明 |
|------|---------|---------|------|
| Docker Hub | 慢/被墙 | 有限 | 不推荐 |
| GitHub Container Registry | 慢 | 有限 | 境外 |
| **阿里云 ACR 个人版** | **快** | **免费** | **选择** |
| 腾讯云 TCR | 快 | 有限 | 备选 |

**选择**：阿里云 ACR 个人版（免费，境内拉取快）

### 5.3 GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Login to ACR
        uses: docker/login-action@v3
        with:
          registry: registry.cn-hangzhou.aliyuncs.com
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      - name: Build & Push Next.js
        run: |
          docker build -t registry.cn-hangzhou.aliyuncs.com/control-universe/next:${{ github.sha }} -f Dockerfile.next .
          docker push ...
      - name: Build & Push Jupyter
        run: |
          docker build -t registry.cn-hangzhou.aliyuncs.com/control-universe/jupyter:${{ github.sha }} -f Dockerfile.jupyter .
          docker push ...
      - name: Deploy to ECS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.ECS_HOST }}
          username: ${{ secrets.ECS_USER }}
          key: ${{ secrets.ECS_SSH_KEY }}
          script: |
            cd /opt/control-universe
            docker compose pull
            docker compose up -d
```

### 5.4 Secrets 配置

| Secret | 说明 |
|--------|------|
| `ACR_USERNAME` | 阿里云容器镜像服务用户名 |
| `ACR_PASSWORD` | 阿里云容器镜像服务密码 |
| `ECS_HOST` | 服务器公网 IP |
| `ECS_USER` | SSH 用户名（root 或 deploy） |
| `ECS_SSH_KEY` | SSH 私钥 |

---

## 6. 访问统计选型

### 6.1 方案对比

| 方案 | 客户端脚本大小 | 隐私 | 自托管 | 说明 |
|------|--------------|------|--------|------|
| 百度统计 | ~20KB | 差 | 否 | 国内常用，但收集数据多 |
| Google Analytics | ~50KB | 差 | 否 | 被墙 |
| **Umami** | ~1KB | **好** | **是** | **选择**，轻量、隐私友好 |
| Plausible | ~1KB | 好 | 是 | 付费（€9/月） |
| GoAccess | 0 | 好 | 是 | 仅分析 Nginx 日志，无实时 |

**选择**：Umami（自托管）

### 6.2 Umami 部署

```yaml
# docker-compose.yml 追加
services:
  umami:
    image: ghcr.io/umami-software/umami:latest
    environment:
      - APP_SECRET=${UMAMI_SECRET}
      - DATABASE_URL=postgresql://umami:umami@umami-db:5432/umami
    depends_on:
      - umami-db
    restart: unless-stopped

  umami-db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=umami
      - POSTGRES_PASSWORD=umami
      - POSTGRES_DB=umami
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: unless-stopped
```

前端集成：在 Next.js layout 中注入 Umami tracking script。

---

## 7. 安全选型

### 7.1 Jupyter API 保护

| 方案 | 说明 | 结论 |
|------|------|------|
| 无认证 | 当前状态，危险 | 不可接受 |
| Basic Auth | Nginx 层认证 | 简单但用户体验差 |
| **Token Header** | Nginx 注入 `X-Jupyter-Token` | **选择**，用户无感知 |
| API Key + Rate Limit | 复杂方案 | 过度设计 |

**实现**：
```nginx
# nginx.conf
location /api/notebook/ {
    proxy_set_header X-Jupyter-Token ${JUPYTER_TOKEN};
    proxy_pass http://jupyter:8891;
}
```

Jupyter 后端校验 Token：
```python
expected_token = os.environ.get("JUPYTER_TOKEN")
if request.headers.get("X-Jupyter-Token") != expected_token:
    return 401
```

### 7.2 服务器安全

| 措施 | 说明 |
|------|------|
| 阿里云安全组 | 仅开放 22(SSH), 80(HTTP) |
| SSH 密钥登录 | 禁用密码登录 |
| fail2ban | 防 SSH 暴力破解 |
| 非 root 运行容器 | Docker 内使用非 root 用户 |

---

## 8. 技术选型决策记录

| 决策点 | 选项 | 选择 | 理由 |
|--------|------|------|------|
| Node 版本 | 18 / 20 / 22 | 20 LTS | 项目兼容，长期支持 |
| Python 版本 | 3.10 / 3.11 / 3.12 | 3.11 | scipy 兼容最佳 |
| 基础镜像 | alpine / slim / full | slim (Python) / alpine (Node) | 体积与兼容性平衡 |
| 镜像仓库 | Docker Hub / ACR / TCR | ACR | 境内速度，免费 |
| 访问统计 | 百度 / Umami / GoAccess | Umami | 隐私友好，轻量自托管 |
| Jupyter 认证 | None / Basic / Token | Token Header | 安全且用户无感知 |
| CI/CD | 手动 / GitHub Actions | GitHub Actions | 免费，自动化 |

---

## 9. 前置条件清单

在进入详细方案（TR3）前，需要完成：

| # | 事项 | 负责方 | 状态 |
|---|------|--------|------|
| 1 | 注册阿里云账号 | 用户 | 待完成 |
| 2 | 购买 ECS 实例（2C4G） | 用户 | 待完成 |
| 3 | 配置安全组（开放 22, 80） | 用户 | 待完成 |
| 4 | 开通 ACR 个人版（免费） | 用户 | 待完成 |
| 5 | 创建 GitHub 仓库（如未公开） | 用户 | 待完成 |
| 6 | 获取服务器 SSH 连接信息 | 用户 | 待完成 |

---

## 10. 下一步

技术选型确认后，进入 **TR3 - 详细方案**，输出：
- 完整 Dockerfile（Next.js / Jupyter）
- docker-compose.yml
- nginx.conf
- GitHub Actions workflow
- 服务器初始化脚本
- 部署操作手册
