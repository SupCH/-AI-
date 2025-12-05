@echo off
chcp 65001 >nul
echo ========================================
echo   🔄 重启博客系统 (Restarting Blog System)
echo ========================================
echo.

echo 🔪 正在关闭现有的 Node.js 进程...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ 已清理旧进程
echo.

echo 🚀 正在启动后端服务...
cd backend
start "Blog Backend" cmd /k "npm run dev"
cd ..

echo 🚀 正在启动前端服务...
cd frontend
start "Blog Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ 服务已启动！
echo 📡 后端: http://localhost:5000
echo 🌐 前端: http://localhost:3000
echo.
echo 请勿关闭弹出的命令行窗口，否则服务将停止。
echo.
pause
