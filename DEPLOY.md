# 🚀 个人博客部署指南 (中国大陆云服务器)

本指南将帮助你将 Neo-Brutalist 博客部署到阿里云、腾讯云等中国大陆服务器。

## 📋 准备工作

1.  **购买服务器**
    *   **推荐系统**: Ubuntu 20.04 LTS 或 22.04 LTS
    *   **配置**: 1核 2G 内存即可（最低配置）
    *   **带宽**: 推荐 3M 以上

2.  **域名 (可选但推荐)**
    *   购买域名并备案（中国大陆服务器必须备案）
    *   解析域名到服务器 IP

---

## 🛠️ 第一步：环境配置

连接到你的服务器（使用 SSH），按顺序执行以下命令：

### 1. 更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 安装 Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```
验证安装：`node -v` (应显示 v18.x.x)

### 3. 安装 Nginx (Web 服务器)
```bash
sudo apt install -y nginx
```

### 4. 安装 PM2 (进程管理)
```bash
sudo npm install -g pm2
```

---

## 📦 第二步：代码部署

### 1. 上传代码
你可以使用 Git 拉取代码，或者使用 SFTP 上传代码包。
假设代码上传到 `/var/www/blog` 目录。

```bash
# 创建目录并设置权限
sudo mkdir -p /var/www/blog
sudo chown -R $USER:$USER /var/www/blog
```

### 2. 安装后端依赖 & 构建
```bash
cd /var/www/blog/backend
npm install
npm run build
```

### 3. 初始化数据库
```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构 (SQLite)
npm run db:push

# (可选) 填充初始数据
npm run db:seed
```

### 4. 安装前端依赖 & 构建
```bash
cd /var/www/blog/frontend
npm install
npm run build
```
构建完成后，生成的静态文件在 `/var/www/blog/frontend/dist` 目录。

---

## 🚀 第三步：启动服务

### 1. 启动后端 (使用 PM2)
回到项目根目录：
```bash
cd /var/www/blog
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
(运行 `pm2 startup` 后，按照提示复制并运行显示的命令，以设置开机自启)

### 2. 配置 Nginx (反向代理)

创建配置文件：
```bash
sudo nano /etc/nginx/sites-available/blog
```

粘贴以下内容（**请修改 `your_domain.com` 为你的域名或服务器 IP**）：

```nginx
server {
    listen 80;
    server_name your_domain.com; # 修改这里

    # 前端静态文件
    location / {
        root /var/www/blog/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件访问
    location /uploads {
        alias /var/www/blog/uploads;
    }
}
```

启用配置并重启 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ✅ 完成！

现在访问你的域名或 IP，应该能看到博客已经上线了！

### 常用维护命令

*   **查看后端日志**: `pm2 logs`
*   **重启后端**: `pm2 restart blog-backend`
*   **更新代码后**:
    1. 拉取新代码
    2. 前端: `npm run build`
    3. 后端: `npm run build` (如果有 TS 更改)
    4. 重启: `pm2 restart blog-backend`
