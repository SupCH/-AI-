@echo off
chcp 65001 >nul
REM 个人博客一键启动脚本 (Windows CMD)
REM 双击运行此文件即可启动开发环境

echo.
echo ========================================
echo   🚀 个人博客开发环境启动脚本
echo ========================================
echo.

cd /d "%~dp0"

REM 检查 Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js 版本: %%i

REM 安装后端依赖
echo.
echo 📦 安装后端依赖...
cd backend

if not exist "node_modules" (
    call npm install
)
echo ✅ 后端依赖已就绪

REM 初始化数据库
echo.
echo 🗄️ 初始化数据库...
call npm run db:generate
call npm run db:push

if not exist "prisma\dev.db" (
    echo 📝 创建初始数据...
    call npm run db:seed
)
echo ✅ 数据库已就绪

REM 安装前端依赖
echo.
echo 📦 安装前端依赖...
cd ..\frontend

if not exist "node_modules" (
    call npm install
)
echo ✅ 前端依赖已就绪

REM 启动服务
echo.
echo ========================================
echo   🎉 启动开发服务器
echo ========================================
echo.
echo 📡 后端: http://localhost:5000
echo 🌐 前端: http://localhost:3000
echo.
echo 👤 管理员: admin@example.com / admin123
echo.
echo 按 Ctrl+C 停止服务
echo.

REM 启动后端（新窗口）
cd ..\backend
start "后端服务" cmd /k "npm run dev"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端（当前窗口）
cd ..\frontend
call npm run dev
