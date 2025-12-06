@echo off
chcp 65001 >nul
echo ==========================================
echo        正在启动自动化测试 Web UI
echo ==========================================

echo.
echo [1/3] 准备测试数据库...
cd backend
call npm run pretest
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 数据库准备失败！
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] 启动后端测试 UI (http://localhost:51204/__vitest__/)
start "后端测试控制台" cmd /k "npm run test:ui"

echo.
echo [3/3] 启动前端测试 UI (http://localhost:51205/__vitest__/)
cd ..\frontend
start "前端测试控制台" cmd /k "npm run test:ui -- --port 51205"

echo.
echo ==========================================
echo        ✅ 已在新窗口中启动测试界面
echo ==========================================
echo 说明:
echo  - 后端 UI: 包含 API 和业务逻辑测试
echo  - 前端 UI: 包含组件和页面测试
echo.
pause
