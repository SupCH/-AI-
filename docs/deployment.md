# 部署指南

本文档介绍如何将博客系统部署到服务器。

## 📦 需要上传的文件

上传整个项目**除了以下目录**：
- `node_modules/` （前端和后端都不需要）
- `frontend/dist/` （会在服务器上构建）
- `backend/prisma/*.db` （数据库文件，可选保留）

### 推荐的 .gitignore

```
node_modules/
dist/
*.db
*.db-journal
.env
```

## 🖥️ 服务器要求

- **操作系统**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **Node.js**: 18.x 或更高版本
- **内存**: 最低 1GB
- **硬盘**: 最低 10GB

## 🚀 部署步骤

### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

### 2. 上传代码

可以使用 Git（推荐）或 SFTP：

```bash
# 使用 Git
git clone https://your-repo-url.git /var/www/blog
cd /var/www/blog

# 或使用 rsync（从本地）
rsync -avz --exclude 'node_modules' --exclude '*.db' ./ user@server:/var/www/blog/
```

### 3. 安装依赖

```bash
# 后端
cd /var/www/blog/backend
npm install --production

# 前端
cd /var/www/blog/frontend
npm install
```

### 4. 配置环境变量

```bash
# 后端环境变量
cd /var/www/blog/backend
cp .env.example .env
nano .env
```

编辑 `.env` 文件：
```env
PORT=5000
DATABASE_URL="file:./prisma/blog.db"
JWT_SECRET="你的超级安全密钥-请修改"
NODE_ENV=production
```

### 5. 初始化数据库

```bash
cd /var/www/blog/backend

# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 初始化管理员账号和示例数据
npm run db:seed
```

### 6. 构建前端

```bash
cd /var/www/blog/frontend
npm run build
```

构建完成后，静态文件会生成在 `frontend/dist/` 目录。

### 7. 使用 PM2 管理后端进程

```bash
# 安装 PM2
sudo npm install -g pm2

# 启动后端
cd /var/www/blog/backend
pm2 start npm --name "blog-api" -- start

# 设置开机启动
pm2 startup
pm2 save
```

### 8. 配置 Nginx

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/blog
```

Nginx 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 前端静态文件
    location / {
        root /var/www/blog/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件目录
    location /uploads {
        alias /var/www/blog/backend/uploads;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 🔧 常用命令

```bash
# 查看后端状态
pm2 status

# 查看日志
pm2 logs blog-api

# 重启后端
pm2 restart blog-api

# 更新代码后重新部署
git pull
cd backend && npm install && pm2 restart blog-api
cd ../frontend && npm install && npm run build
```

## 🔥 防火墙配置

```bash
# Ubuntu (UFW)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## ⚠️ 安全建议

1. **修改默认管理员密码** - 部署后立即登录修改
2. **使用强 JWT 密钥** - 至少 32 个随机字符
3. **启用 HTTPS** - 保护数据传输
4. **定期备份数据库** - `backend/prisma/blog.db`
5. **设置防火墙** - 仅开放必要端口

## 🐛 常见问题

### Q: 前端页面刷新 404
A: 检查 Nginx 的 `try_files` 配置是否正确。

### Q: API 请求失败
A: 检查后端是否运行 (`pm2 status`)，查看日志 (`pm2 logs`)。

### Q: 数据库权限问题
A: 确保 `backend/prisma` 目录有写入权限：
```bash
chmod 755 /var/www/blog/backend/prisma
```

### Q: 上传文件失败
A: 确保 `backend/uploads` 目录存在且有写入权限：
```bash
mkdir -p /var/www/blog/backend/uploads
chmod 755 /var/www/blog/backend/uploads
```
