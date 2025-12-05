# 🏠 本地 Windows 服务器部署指南 (FRP + Cloudflare)

本指南适用于：在本地 Windows 服务器上运行博客，通过 FRP 内网穿透对外提供服务，使用 Cloudflare 托管域名。

## 📋 前提条件

- ✅ 本地 Windows 服务器（已安装 Node.js）
- ✅ FRP 客户端 (frpc) 已配置好，有可用的 FRP 服务端
- ✅ Cloudflare 上托管的域名

---

## 🛠️ 第一步：本地服务配置

### 1. 构建项目

打开 PowerShell，进入项目目录：

```powershell
cd D:\风格个人博客

# 后端构建
cd backend
npm install
npm run build
npm run db:generate
npm run db:push
npm run db:seed  # 首次运行，填充初始数据

# 前端构建
cd ..\frontend
npm install
npm run build
```

### 2. 启动后端服务

```powershell
cd D:\风格个人博客\backend
npm run start
# 或者使用 pm2 (需要先安装: npm install -g pm2)
# pm2 start dist/index.js --name blog-backend
```

后端会在 `http://localhost:5000` 运行。

### 3. 前端静态文件

前端构建后的文件在 `D:\风格个人博客\frontend\dist` 目录。
我们需要用 Nginx 或 Node.js 托管这些静态文件。

#### 方案 A：使用 serve (最简单)

```powershell
npm install -g serve
cd D:\风格个人博客\frontend
serve -s dist -l 3000
```

#### 方案 B：使用 Nginx for Windows

1. 下载 Nginx for Windows: http://nginx.org/en/download.html
2. 解压到 `C:\nginx`
3. 配置 `C:\nginx\conf\nginx.conf`：

```nginx
http {
    server {
        listen       80;
        server_name  localhost;

        # 前端静态文件
        location / {
            root   D:/风格个人博客/frontend/dist;
            index  index.html;
            try_files $uri $uri/ /index.html;
        }

        # 后端 API 反向代理
        location /api {
            proxy_pass http://localhost:5000;
        }

        # 上传文件
        location /uploads {
            alias D:/风格个人博客/backend/uploads;
        }
    }
}
```

4. 启动 Nginx：
```powershell
cd C:\nginx
.\nginx.exe
```

---

## 🔗 第二步：FRP 内网穿透配置

假设您的 FRP 服务端地址是 `frp.example.com`，端口是 `7000`。

### frpc.toml 配置示例

```toml
serverAddr = "frp.example.com"
serverPort = 7000
auth.token = "your_frp_token"

[[proxies]]
name = "blog-web"
type = "http"
localIP = "127.0.0.1"
localPort = 80          # Nginx 监听的端口
customDomains = ["blog.yourdomain.com"]  # 你的域名
```

如果使用旧版 frpc.ini 格式：

```ini
[common]
server_addr = frp.example.com
server_port = 7000
token = your_frp_token

[blog-web]
type = http
local_ip = 127.0.0.1
local_port = 80
custom_domains = blog.yourdomain.com
```

### 启动 FRP 客户端

```powershell
.\frpc.exe -c frpc.toml
```

---

## ☁️ 第三步：Cloudflare 配置

### 1. 添加 DNS 记录

在 Cloudflare 控制台，为你的域名添加 DNS 记录：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|---------|
| A 或 CNAME | blog | 指向 FRP 服务端 IP 或域名 | 已代理（橙色云朵）|

**注意**：
- 如果 FRP 服务端有固定 IP，使用 A 记录指向该 IP。
- 如果使用 FRP 的 HTTP 类型穿透，需要确保 FRP 服务端的 vhost_http_port（通常是 80 或 8080） 对外开放。

### 2. SSL/HTTPS 配置

在 Cloudflare 中：
1. 进入 **SSL/TLS** 设置
2. 选择 **灵活 (Flexible)** 模式（推荐，因为本地是 HTTP）
   - 或者选择 **完全 (Full)** 模式（如果本地 Nginx 也配置了 HTTPS）

### 3. 页面规则 (可选)

- 强制 HTTPS：添加规则 `blog.yourdomain.com/*` → Always Use HTTPS

---

## 🚀 第四步：一键启动脚本

创建 `start-server.bat` 放在项目根目录：

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 启动博客服务 (FRP 内网穿透版)
echo ========================================

REM 启动后端
cd /d D:\风格个人博客\backend
start "Blog Backend" cmd /k "npm run start"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端静态服务
cd /d D:\风格个人博客\frontend
start "Blog Frontend" cmd /k "serve -s dist -l 80"

REM 启动 FRP 客户端 (请修改路径)
REM start "FRP Client" cmd /k "C:\frp\frpc.exe -c C:\frp\frpc.toml"

echo.
echo ✅ 服务已启动！
echo 📡 本地访问: http://localhost
echo 🌐 外网访问: https://blog.yourdomain.com
echo.
pause
```

---

## 📊 架构图

```
[用户] 
   ↓ HTTPS
[Cloudflare CDN] ──→ [FRP 服务端] ──→ [FRP 客户端 (本地)]
                                           ↓
                                    [Nginx / serve]
                                     ↙         ↘
                              [前端静态文件]  [后端 API :5000]
                                                  ↓
                                              [SQLite DB]
```

---

## ❓ 常见问题

### Q: 访问显示 502 Bad Gateway？
A: 检查后端服务是否正常运行 (`http://localhost:5000/health`)

### Q: API 请求失败？
A: 检查 Nginx 的 `/api` 反向代理配置是否正确

### Q: FRP 连接不上？
A: 检查 FRP token、服务端地址和端口是否正确

### Q: HTTPS 证书错误？
A: 确保 Cloudflare 的 SSL 设置为"灵活"模式
