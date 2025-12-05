---
description: 如何启动博客开发环境
---

# 启动开发环境

// turbo-all

## 步骤

1. 安装后端依赖
```bash
cd backend && npm install
```

2. 生成 Prisma 客户端
```bash
cd backend && npm run db:generate
```

3. 初始化数据库
```bash
cd backend && npm run db:push
```

4. 添加示例数据
```bash
cd backend && npm run db:seed
```

5. 启动后端服务
```bash
cd backend && npm run dev
```

6. 新终端安装前端依赖
```bash
cd frontend && npm install
```

7. 启动前端开发服务器
```bash
cd frontend && npm run dev
```

8. 访问博客
- 前台: http://localhost:3000
- 登录: admin@example.com / admin123
