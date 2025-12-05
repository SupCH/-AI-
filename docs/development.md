# 开发规范

## 代码风格

### TypeScript

- 使用 TypeScript 严格模式
- 明确定义类型，避免使用 `any`
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型或复杂类型

```typescript
// ✅ 好的写法
interface User {
  id: number
  name: string
  email: string
}

// ❌ 避免
const user: any = {}
```

### React 组件

- 使用函数式组件 + Hooks
- 组件文件使用 `.tsx` 扩展名
- 每个组件对应一个 CSS 文件
- 使用 CSS Modules 或命名约定避免样式冲突

```tsx
// 组件结构
import { useState, useEffect } from 'react'
import './ComponentName.css'

interface Props {
  title: string
}

function ComponentName({ title }: Props) {
  const [state, setState] = useState('')
  
  return <div className="component-name">{title}</div>
}

export default ComponentName
```

### CSS

- 使用 CSS Variables 定义主题变量
- 使用 BEM 或组件名作为类名前缀
- 响应式设计使用移动优先
- 颜色、间距等使用变量

```css
/* ✅ 使用变量 */
.post-card {
  padding: var(--spacing-lg);
  background: var(--glass-bg);
  border-radius: var(--border-radius);
}

/* ❌ 避免硬编码 */
.post-card {
  padding: 24px;
  background: rgba(30, 41, 59, 0.7);
}
```

---

## 项目约定

### 文件命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| React 组件 | PascalCase | `PostCard.tsx` |
| 样式文件 | 与组件同名 | `PostCard.css` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量文件 | camelCase | `constants.ts` |

### 目录结构

```
src/
├── components/     # 可复用组件
├── pages/          # 页面组件
│   └── admin/      # 后台管理页面
├── hooks/          # 自定义 Hooks
├── services/       # API 服务
├── styles/         # 全局样式
└── utils/          # 工具函数
```

---

## Git 提交规范

使用语义化提交信息：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/配置变更
```

示例：
```
feat: 添加文章评论功能
fix: 修复登录页面样式问题
docs: 更新 API 文档
```

---

## 开发流程

1. 创建功能分支：`git checkout -b feature/xxx`
2. 开发并测试
3. 提交代码
4. 创建 Pull Request
5. 代码审查
6. 合并到主分支
