# TR1 - 需求拆解：Control Universe Wiki 上线

> 版本：v1.1 | 日期：2026-09-22 | 状态：需求已确认，待进入技术选型

## 1. 背景与目标

将本地运行的 Control Universe Wiki（Next.js + Python Jupyter 双运行时）部署到公网，使任意用户通过浏览器即可访问全部课程内容，包括 Jupyter 交互式 Python 编程、ECharts 交互图表、KaTeX 数学公式渲染等功能。

**当前架构**：
- Next.js 14（App Router）前端，端口 8080
- Python Jupyter Kernel Server（`jupyter_server.py`），端口 8891
- `serve.mjs` 编排两个进程，仅绑定 `127.0.0.1`
- 前端 Jupyter 组件硬编码 `http://127.0.0.1:8891`

**目标架构**：
- Docker Compose 容器化部署
- Nginx 反向代理统一入口
- 公网 HTTPS 访问
- Jupyter 功能完整可用

---

## 2. 需求分类总览

| 分类 | 编号范围 | 需求数 | 优先级 |
|------|---------|--------|--------|
| A. 功能适配 | A01-A06 | 6 | P0-P1 |
| B. 容器化 | B01-B04 | 4 | P0 |
| C. 网络与访问 | C01-C05 | 5 | P0-P2 |
| D. 安全 | D01-D05 | 5 | P0 |
| E. 运维与监控 | E01-E05 | 5 | P1-P2 |
| F. 数据与持久化 | F01-F03 | 3 | P1 |
| G. 性能与优化 | G01-G03 | 3 | P2 |
| H. 访问分析 | H01 | 1 | P1 |

---

## 3. 详细需求

### A. 功能适配（Functional Adaptation）

> 现有功能从本地环境迁移到线上环境所需的代码改造。

#### A01 [P0] Jupyter 前端请求地址可配置化

**现状**：`jupyter-notebook.tsx` 第 23 行硬编码 `const API = "http://127.0.0.1:8891"`。
**要求**：
- 改为相对路径或从环境变量/运行时配置读取
- 线上通过 Nginx 反代 `/api/notebook/*` → Jupyter 后端
- 本地开发仍可直接访问 8891 端口
**验收**：本地 `npm run dev` 和线上 Docker 环境均可正常使用 Jupyter 组件

#### A02 [P0] Jupyter 后端监听地址适配

**现状**：`jupyter_server.py` 第 194 行绑定 `("127.0.0.1", PORT)`。
**要求**：
- Docker 容器内绑定 `0.0.0.0`
- 通过环境变量控制监听地址，默认 `0.0.0.0`
- 本地开发默认保持 `127.0.0.1` 不变
**验收**：容器内 Jupyter 服务可被同网络 Nginx 容器访问

#### A03 [P0] 生产模式进程编排

**现状**：`serve.mjs` 同时启动 Next.js dev 模式和 Jupyter 服务器。
**要求**：
- Docker 环境下各服务独立容器（Next.js / Jupyter / Nginx）
- 不再依赖 `serve.mjs` 做进程管理
- `serve.mjs` 保留给本地开发使用
**验收**：`docker compose up` 启动全部服务，各容器独立重启互不影响

#### A04 [P1] Next.js 生产构建适配

**现状**：`next.config.mjs` 使用 `images: { unoptimized: true }`，未配置 `output` 模式。
**要求**：
- 确认 `next build` 在 Docker 内可正常完成
- 评估是否启用 `standalone` output 模式以减小镜像体积
- 构建时不依赖外部服务（Jupyter 服务不参与构建）
**验收**：`next build` 在 Docker 构建阶段零报错

#### A05 [P1] 中文字体支持

**现状**：`jupyter_server.py` 的 `DEFAULT_SETUP` 设置 `plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', ...]`，依赖 Windows 系统字体。
**要求**：
- Docker 镜像内安装中文字体（如 Noto Sans CJK / WenQuanYi）
- 更新 `DEFAULT_SETUP` 的字体列表，优先使用镜像内字体
- 确保 Matplotlib 图表中文标注正常显示
**验收**：线上运行 `plt.title("传递函数")` 图表中文不出现方块

#### A06 [P1] 环境变量体系

**要求**：统一管理以下配置项，通过环境变量或 `.env` 文件注入：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PORT` | Next.js 监听端口 | `8080` |
| `JUPYTER_PORT` | Jupyter 服务端口 | `8891` |
| `JUPYTER_HOST` | Jupyter 监听地址 | `0.0.0.0`（容器内） |
| `JUPYTER_IDLE_TIMEOUT` | 内核空闲回收阈值（秒），`0` 表示关闭 | `1800` |
| `JUPYTER_REAP_INTERVAL` | 空闲回收巡检周期（秒） | `60` |
| `NODE_ENV` | Node 环境 | `production` |
| `JUPYTER_API_URL` | 前端请求 Jupyter 的地址 | `/api/notebook`（相对路径） |

**验收**：修改 `.env` 文件后重启即可生效，无需改代码

---

### B. 容器化（Containerization）

> Docker 镜像与编排相关需求。

#### B01 [P0] Next.js 应用 Dockerfile

**要求**：
- 多阶段构建：deps → builder → runner
- 基于 `node:20-alpine`（或 22-alpine）
- 仅包含运行所需文件，不包含开发依赖
- 如启用 standalone output，使用 standalone 产物
**验收**：镜像体积 < 300MB，`docker run` 可正常提供 Wiki 页面

#### B02 [P0] Jupyter 服务 Dockerfile

**要求**：
- 基于 `python:3.11-slim`（或 3.12）
- 安装 `requirements.txt` 中的依赖（`jupyter_client`, `ipykernel`, `matplotlib`, `numpy`, `scipy`, `control`）
- 安装中文字体（A05）
- 非 root 用户运行
**验收**：镜像可正常启动，`/health` 返回 `{"status": "ok"}`

#### B03 [P0] Docker Compose 编排

**要求**：
- 三个服务：`next`、`jupyter`、`nginx`
- 网络隔离：`jupyter` 仅对 `nginx` 可见，不暴露公网
- 健康检查：每个服务配置 `healthcheck`
- 依赖关系：`nginx` 依赖 `next` + `jupyter`
- 数据卷：日志持久化
**验收**：`docker compose up -d` 一键启动，`docker compose ps` 全部 healthy

#### B04 [P1] .dockerignore 配置

**要求**：
- 排除 `node_modules`、`.next`、`.git`、`logs`、`docs`、本地脚本（`start.bat`）等
- 确保构建上下文最小化
**验收**：`docker build` 上下文传输 < 50MB

---

### C. 网络与访问（Network & Access）

> 用户如何访问服务、流量如何路由。

#### C01 [P0] Nginx 反向代理

**要求**：
- 80/443 端口统一入口
- `/` → Next.js 后端
- `/api/notebook/*` → Jupyter 后端
- 支持 WebSocket 升级（为未来扩展预留）
- 合理的 proxy timeout（Jupyter 代码执行可能耗时 30s+）
**验收**：访问 `http://<domain>/` 看到 Wiki 首页，Jupyter 组件可正常执行代码

#### C02 [P0] HTTPS 证书（初期暂缓）

**当前状态**：无域名、无 ICP 备案，初期通过 IP 直接访问。
**初期方案**：仅 HTTP（80 端口），Jupyter API 通过 Docker 内网隔离 + Token 保护（见 D01）。
**后续启用条件**：域名注册 + ICP 备案完成后，配置 Let's Encrypt 自动签发 + HTTP→HTTPS 重定向。
**验收（初期）**：`http://<server-ip>` 可正常访问 Wiki 全部功能

#### C03 [P2] 域名配置（后续任务）

**当前状态**：无域名，初期通过 IP 访问。
**后续步骤**（不在本期范围内，但需提前规划）：
- 注册域名（阿里云万网 / 腾讯云 DNSPod）
- ICP 备案（阿里云提供代办流程，约 7-20 个工作日）
- DNS A 记录指向服务器 IP
- 备案通过后启用 HTTPS（C02）
**验收（本期）**：通过 `http://<server-ip>` 可正常访问

#### C04 [P1] 端口规划

| 端口 | 服务 | 暴露范围 |
|------|------|---------|
| 80 | Nginx（HTTP→HTTPS 重定向） | 公网 |
| 443 | Nginx（HTTPS） | 公网 |
| 8080 | Next.js | 仅 Docker 内部网络 |
| 8891 | Jupyter | 仅 Docker 内部网络 |

**要求**：除 Nginx 外，其他端口不对外暴露。
**验收**：`nmap <server-ip>` 仅发现 80/443

#### C05 [P2] 可选：静态资源 CDN 缓存

**要求**：
- Nginx 对 `/_next/static/*` 设置长缓存（`Cache-Control: max-age=31536000, immutable`）
- 对 `/katex/*` 静态资源设置长缓存
**验收**：浏览器 DevTools 确认静态资源命中缓存

---

### D. 安全（Security）

> 公网暴露后的安全防护。**关键：Jupyter 服务允许执行任意 Python 代码，是最高安全风险点。**

#### D01 [P0] Jupyter API 访问认证

**现状**：Jupyter 服务无任何认证，任何人可创建 Kernel 执行任意 Python 代码。
**要求**：
- 为 Jupyter 服务添加 Token 认证机制
- 前端请求携带 Token（通过 Nginx 注入 Header 或前端配置）
- Token 通过环境变量配置，不硬编码
**验收**：不带 Token 的请求返回 401；前端正常携带 Token 可执行代码

#### D02 [P0] 代码执行沙箱限制

**现状**：Python Kernel 可访问完整文件系统、网络、进程。
**要求**：
- 限制可执行的 Python 代码超时时间（已有 30s timeout，确认线上合理值）
- 限制 Kernel 进程的系统权限（非 root 运行，限制文件访问范围）
- 评估是否需要网络隔离（Kernel 容器禁止访问外网）
- 限制同时存在的 Kernel 数量（防止资源耗尽）
**验收**：
- `import os; os.system('rm -rf /')` 不会造成实际损害
- 超过 N 个并发 Kernel 时返回拒绝

#### D03 [P0] Nginx 安全头

**要求**：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`（根据实际需要配置）
**验收**：安全扫描工具检测无缺失安全头

#### D04 [P1] 请求限流

**要求**：
- Nginx 层对 `/api/notebook/*` 限流（如 10 req/s per IP）
- 防止恶意用户频繁创建 Kernel 耗尽服务器资源
**验收**：超过限流阈值返回 429

#### D05 [P1] SVG/HTML 输出 XSS 防护

**现状**：`jupyter-notebook.tsx` 中 SVG 和 HTML 输出使用 `dangerouslySetInnerHTML` 直接渲染。
**要求**：
- 评估 XSS 风险：用户自己的 Python 输出 → 理论上是可信的
- 线上环境多用户场景下，考虑对 HTML 输出做 sanitize（DOMPurify）
- 或明确标注：Jupyter 输出为「自执行代码结果」，视为可信内容
**验收**：`from IPython.display import HTML; HTML('<script>alert(1)</script>')` 不会执行脚本

---

### E. 运维与监控（Operations & Monitoring）

> 上线后的日常运维、故障排查、健康监控。

#### E01 [P1] 日志收集

**要求**：
- 所有容器日志通过 `docker logs` 可查
- 日志包含时间戳
- Nginx 访问日志 + 错误日志持久化到宿主机
- Jupyter 操作日志（Kernel 创建/执行/销毁）可追溯
**验收**：`docker compose logs -f` 可实时查看全部服务日志

#### E02 [P1] 健康检查与自动恢复

**要求**：
- Docker Compose 配置 `restart: unless-stopped`
- 每个服务配置 `healthcheck`
- Jupyter 服务已有 `/health` 端点
- Next.js 需添加 `/api/health` 端点（或利用已有机制）
**验收**：`kill` 掉某个容器进程后，Docker 自动重启

#### E03 [P2] 资源限制

**要求**：
- Docker Compose 中为每个服务设置 `mem_limit` / `cpus` 限制
- Jupyter 容器限制尤为重要（Python 计算可能消耗大量 CPU/内存）
- 建议值：Next.js 512MB/1CPU，Jupyter 2GB/2CPU，Nginx 128MB/0.5CPU
**验收**：`docker stats` 显示各容器资源使用在限制范围内

#### E04 [P2] 部署脚本

**要求**：
- 编写 `deploy.sh`：拉取代码 → 构建镜像 → 重启服务
- 支持回滚到上一版本
- 零停机或最小停机部署（评估是否需要）
**验收**：执行 `./deploy.sh` 完成上线，总停机 < 30s

#### E05 [P2] 备份策略

**要求**：
- 定期备份 MDX 内容文件（或确认 Git 已覆盖）
- 日志轮转（logrotate 或 Docker logging driver 配置）
- 服务器级快照（依赖云服务商）
**验收**：有明确的备份频率和恢复流程文档

---

### F. 数据与持久化（Data & Persistence）

#### F01 [P1] 日志持久化

**要求**：
- Docker volume 挂载日志目录
- 日志轮转配置：单文件 < 50MB，保留 7 天
**验收**：容器重启后历史日志不丢失

#### F02 [P1] Kernel 状态生命周期

**现状**：Kernel 在用户关闭页面时通过 `useEffect` cleanup 发送 DELETE 请求销毁。
**要求**：
- 确认线上环境下 cleanup 能可靠触发（页面关闭、浏览器崩溃、网络断开）
- 添加 Kernel 超时自动回收机制（如 30 分钟无活动自动销毁）
- 防止孤儿 Kernel 累积耗尽内存
**验收**：长时间运行后 `GET /health` 的 `kernels` 数量保持合理

#### F03 [P2] 用户上传/输出持久化（可选）

**说明**：当前无用户上传功能，Jupyter 输出仅在会话内存在。
**要求**：暂不需要持久化，Kernel 销毁后输出清除。
**验收**：确认重启后无残留数据

---

### G. 性能与优化（Performance）

#### G01 [P2] Next.js 构建优化

**要求**：
- 启用 `standalone` output 模式（减小镜像体积）
- 评估 `generateStaticParams` 的 SSG 效果（所有课程页面可预渲染）
- Shiki 代码高亮主题按需加载
**验收**：首屏 LCP < 2s（目标值，取决于服务器性能）

#### G02 [P2] Jupyter Kernel 预热

**说明**：首次创建 Kernel 需要启动 Python 解释器 + 导入 numpy/scipy，耗时约 5-10s。
**要求**：
- 评估是否需要预热 Kernel 池（启动时预创建 N 个 Kernel）
- 或接受首次延迟，在 UI 上给出明确提示
**验收**：用户感知到 Kernel 初始化状态（已有"初始化中..."提示）

#### G03 [P2] 镜像层缓存优化

**要求**：
- Dockerfile 中 `COPY requirements.txt` 在前，`COPY .` 在后
- 利用 Docker 层缓存加速重复构建
**验收**：无代码变更时 `docker build` < 30s

---

## 4. 需求依赖关系

```
A01 (前端地址) ──┐
A02 (后端地址) ──┤
A03 (进程编排) ──┼── B01 (Next Dockerfile) ──┐
A04 (构建适配) ──┤                           ├── B03 (Compose) ── C01 (Nginx) ── C02 (HTTPS)
A05 (中文字体) ──┤── B02 (Jupyter Dockerfile)┘
A06 (环境变量) ──┘

D01 (认证) ── 依赖 C01 完成
D02 (沙箱) ── 依赖 B02 完成
D05 (XSS)  ── 依赖 A01 完成

E01-E05 ── 依赖 B03 完成
F01-F03 ── 依赖 B03 完成
G01-G03 ── 依赖 B01/B02 完成
```

## 5. 优先级排期建议

### Phase 1 — 最小可用（P0，预计 2-3 天）

| 需求 | 说明 |
|------|------|
| A01 | 前端请求地址可配置 |
| A02 | 后端监听地址适配 |
| A03 | Docker 独立容器 |
| B01 | Next.js Dockerfile |
| B02 | Jupyter Dockerfile |
| B03 | Docker Compose 编排 |
| C01 | Nginx 反向代理（HTTP only） |
| C02 | HTTP 访问（HTTPS 待域名备案后启用） |
| D01 | Jupyter API Token 保护（Nginx 注入 Header，用户无感知） |
| D02 | 执行沙箱限制 |
| D03 | Nginx 安全头 |

### Phase 2 — 生产加固（P1，预计 1-2 天）

| 需求 | 说明 |
|------|------|
| A04 | 生产构建适配 |
| A05 | 中文字体 |
| A06 | 环境变量体系 |
| B04 | .dockerignore |
| C04 | 端口规划（仅暴露 80） |
| D04 | 请求限流 |
| D05 | XSS 防护 |
| E01 | 日志收集 |
| E02 | 健康检查 |
| F01 | 日志持久化 |
| F02 | Kernel 生命周期 |
| H01 | 访问统计 |

### Phase 3 — 优化打磨（P2，预计 1 天）

| 需求 | 说明 |
|------|------|
| C03 | 域名注册 + ICP 备案（独立流程，非技术阻塞项） |
| C05 | 静态资源缓存 |
| E03 | 资源限制 |
| E04 | 部署脚本 |
| E05 | 备份策略 |
| F03 | 输出持久化评估 |
| G01 | 构建优化 |
| G02 | Kernel 预热 |
| G03 | 镜像缓存 |

---

## 6. 已确认决策

> 以下问题已与项目方确认，结论直接影响后续技术选型与详细方案。

| # | 问题 | 决策 | 影响 |
|---|------|------|------|
| 1 | 云服务商 | **阿里云** | 服务器选型、安全组配置、快照备份 |
| 2 | 域名与备案 | **无域名、无备案、新手** | 初期通过 IP 直接访问；HTTPS 方案需调整（见 C02 备注）；域名注册+ICP 备案作为后续独立任务 |
| 3 | 预期流量 | **~100 次新页面访问/小时** | 单台 2C4G 足够；Kernel 并发限制建议 ≤5；后续可垂直扩容 |
| 4 | 访问统计 | **需要** | 新增需求 H01（访问分析） |
| 5 | 用户体系 | **完全公开，无需登录** | D01 仅保护 Jupyter API（防滥用），Wiki 页面无需认证 |
| 6 | CI/CD | **暂不需要，Phase 3 考虑** | 初期手动部署（deploy.sh），后续可引入 GitHub Actions |

### 决策衍生的方案调整

**C02 HTTPS 调整**：无域名时无法使用 Let's Encrypt 签发受信任证书。初期方案：
- 方案 A（推荐）：仅开放 HTTP（80 端口），通过 IP 直接访问。Jupyter API 通过内网 Token 保护，不暴露到公网。
- 方案 B：使用自签名证书（浏览器会报不安全警告，体验差）。
- 待域名备案完成后，再启用 HTTPS（Let's Encrypt 自动签发）。

**D01 Jupyter 认证调整**：Wiki 页面完全公开，但 Jupyter API 仍需保护（防止被外部滥用执行恶意代码）。方案：
- Jupyter 容器不暴露公网端口（仅 Docker 内部网络可达）
- Nginx 反代 `/api/notebook/*` 时注入 Token Header
- Token 通过环境变量配置，前端通过 Nginx 代理请求（用户无感知）
- 效果：外部用户只能用 Wiki 页面上的 Jupyter 组件，无法直接调用 API

**新增 H01 访问统计需求**：归入 H 类（见下方）。

---

## 7. 补充需求

### H. 访问分析（Analytics）

#### H01 [P1] 页面访问统计

**要求**：
- 统计 PV/UV、各页面访问量、来源referrer
- 方案选择（技术选型阶段确定）：
  - 自建：Nginx access.log + GoAccess 报表
  - 第三方：Umami（自托管、隐私友好）、Plausible、或百度统计
- 不影响页面性能（脚本 < 5KB 或零客户端脚本）
- 可视化面板（可选，Phase 3）
**验收**：可查看每日访问量、热门课程页面排名

---

## 8. 非目标（明确不做的事）

- **不做**：多区域/CDN 部署（单服务器足够）
- **不做**：数据库（当前无持久化数据需求）
- **不做**：用户登录/注册系统（完全公开站点）
- **不做**：Pyodide 浏览器端 Python（scipy/control 兼容性不够）
- **不做**：Kubernetes（规模不需要）
- **不做**：自动扩缩容（单实例固定配置）
- **不做**：CI/CD 自动部署（Phase 1-2 手动，Phase 3 评估）
- **暂不做**：HTTPS（无域名，待备案后启用）
