#!/bin/bash
# 个人博客一键启动脚本 (Linux/Mac)
# 使用: chmod +x start-dev.sh && ./start-dev.sh

set -e

echo ""
echo "========================================"
echo "  🚀 个人博客开发环境启动脚本"
echo "========================================"
echo ""

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 安装后端依赖
echo ""
echo "📦 安装后端依赖..."
cd "$ROOT_DIR/backend"

if [ ! -d "node_modules" ]; then
    npm install
fi
echo "✅ 后端依赖已就绪"

# 初始化数据库
echo ""
echo "🗄️ 初始化数据库..."
npm run db:generate
npm run db:push

if [ ! -f "prisma/dev.db" ]; then
    echo "📝 创建初始数据..."
    npm run db:seed
fi
echo "✅ 数据库已就绪"

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
cd "$ROOT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    npm install
fi
echo "✅ 前端依赖已就绪"

# 启动服务
echo ""
echo "========================================"
echo "  🎉 启动开发服务器"
echo "========================================"
echo ""
echo "📡 后端: http://localhost:5000"
echo "🌐 前端: http://localhost:3000"
echo ""
echo "👤 管理员: admin@example.com / admin123"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 使用 trap 确保清理后台进程
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# 启动后端（后台）
cd "$ROOT_DIR/backend"
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端（前台）
cd "$ROOT_DIR/frontend"
npm run dev

# 等待后端进程
wait $BACKEND_PID
