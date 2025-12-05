# 个人博客系统

一个现代化的全栈个人博客系统，使用 React + Express + SQLite 构建。

## ✨ 功能特性

- 📝 文章管理（发布、编辑、删除）
- 🏷️ 标签分类系统
- 💬 评论功能
- 🔐 JWT 认证
- 🎨 现代化暗色主题 UI
- 📱 响应式设计

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 18 + TypeScript + Vite |
| **后端** | Node.js + Express + TypeScript |
| **数据库** | SQLite + Prisma ORM |
| **样式** | Vanilla CSS + CSS Variables |

## 📁 项目结构

```
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 服务
│   │   └── styles/       # CSS 样式
│   └── package.json
├── backend/           # 后端项目
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── utils/        # 工具函数
│   ├── prisma/           # 数据库模型
│   └── package.json
└── docs/              # 文档
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 初始化数据库

```bash
cd backend

# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 初始化数据（创建管理员和示例数据）
npm run db:seed
```

### 启动开发服务器

```bash
# 后端（端口 5000）
cd backend
npm run dev

# 前端（端口 3000）
cd frontend
npm run dev
```

访问 http://localhost:3000 查看博客

### 管理员登录

- 邮箱：`admin@example.com`
- 密码：`admin123`

## 📚 文档

- [API 文档](docs/api.md)
- [开发规范](docs/development.md)
- [部署文档](docs/deployment.md)

## 📄 许可证

MIT License
