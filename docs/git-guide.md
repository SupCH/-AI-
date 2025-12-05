# Git 版本控制指南

本指南介绍如何使用 Git 进行版本控制和远程协作。

## 📦 安装 Git

### Windows
下载安装：https://git-scm.com/download/win

安装后打开 PowerShell 验证：
```powershell
git --version
```

---

## 🚀 初始化项目

### 首次配置（全局设置）

```bash
git config --global user.name "你的名字"
git config --global user.email "your@email.com"
```

### 初始化仓库

```bash
cd E:\风格个人博客
git init
```

### 添加 .gitignore

项目根目录已有 `.gitignore` 文件，确保包含：
```
node_modules/
dist/
*.db
*.db-journal
.env
```

---

## 📝 日常工作流程

### 1. 查看状态

```bash
git status
```

### 2. 添加更改

```bash
# 添加单个文件
git add filename.ts

# 添加所有更改
git add .
```

### 3. 提交更改

```bash
git commit -m "描述这次更改做了什么"
```

**提交信息规范：**
```
feat: 添加随机文章功能
fix: 修复登录验证问题
docs: 更新 API 文档
style: 调整移动端样式
refactor: 重构标签控制器
```

### 4. 查看历史

```bash
git log --oneline -10
```

---

## 🌐 远程仓库（GitHub/Gitee）

### 创建远程仓库

1. 在 GitHub/Gitee 上创建新仓库
2. **不要**勾选 "Initialize with README"

### 连接远程仓库

```bash
# GitHub
git remote add origin https://github.com/你的用户名/风格个人博客.git

# 或 Gitee
git remote add origin https://gitee.com/你的用户名/风格个人博客.git

# 查看远程仓库
git remote -v
```

### 首次推送

```bash
git branch -M main
git push -u origin main
```

### 日常推送

```bash
git push
```

### 拉取远程更新

```bash
git pull
```

---

## 🔑 SSH 密钥配置（推荐）

避免每次输入密码：

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "your@email.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

将公钥添加到 GitHub/Gitee 的 SSH Keys 设置中。

然后使用 SSH 地址：
```bash
git remote set-url origin git@github.com:用户名/仓库名.git
```

---

## 🌿 分支管理

### 创建分支

```bash
git checkout -b feature/新功能名
```

### 切换分支

```bash
git checkout main
```

### 合并分支

```bash
git checkout main
git merge feature/新功能名
```

### 删除分支

```bash
git branch -d feature/新功能名
```

---

## ⏪ 撤销操作

### 撤销未暂存的修改

```bash
git checkout -- filename.ts
```

### 撤销已暂存的修改

```bash
git reset HEAD filename.ts
```

### 撤销最近一次提交（保留更改）

```bash
git reset --soft HEAD~1
```

### 撤销最近一次提交（丢弃更改）

```bash
git reset --hard HEAD~1
```

---

## 🔄 在服务器上部署

### 服务器首次克隆

```bash
cd /var/www
git clone https://github.com/用户名/风格个人博客.git blog
cd blog
npm install
```

### 服务器更新代码

```bash
cd /var/www/blog
git pull
npm install  # 如果依赖有变化
pm2 restart all
```

---

## 📋 常用命令速查

| 命令 | 说明 |
|------|------|
| `git status` | 查看当前状态 |
| `git add .` | 暂存所有更改 |
| `git commit -m "msg"` | 提交更改 |
| `git push` | 推送到远程 |
| `git pull` | 拉取远程更新 |
| `git log --oneline` | 查看简洁历史 |
| `git diff` | 查看未暂存的更改 |
| `git branch` | 列出分支 |
| `git checkout -b name` | 创建并切换分支 |
| `git stash` | 暂存当前更改 |
| `git stash pop` | 恢复暂存的更改 |

---

## 🎯 立即开始

```bash
# 初始化并首次提交
cd E:\风格个人博客
git init
git add .
git commit -m "feat: 初始化博客项目"

# 连接远程并推送
git remote add origin https://github.com/你的用户名/blog.git
git branch -M main
git push -u origin main
```

完成！现在你的代码已经有版本控制并备份到云端了。
