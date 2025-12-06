@echo off
chcp 65001 >nul
title 博客系统管理助手
:menu
cls
echo ========================================================
echo               Neo-Brutalist 博客系统管理助手
echo ========================================================
echo.
echo    [1] 🚀 启动博客系统 (开发模式)
echo    [2] 🧪 运行自动化测试 (命令行版)
echo    [3] 🖥️ 启动测试控制台 (Web UI版)
echo    [4] 🛑 停止所有服务 (清理端口)
echo.
echo    [0] 🚪 退出
echo.
echo ========================================================
set /p choice=请选择操作 (0-4): 

if "%choice%"=="1" goto start_blog
if "%choice%"=="2" goto run_tests
if "%choice%"=="3" goto run_test_ui
if "%choice%"=="4" goto stop_services
if "%choice%"=="0" exit
goto menu

:start_blog
cls
echo [1/2] 启动后端服务...
cd backend
start "Blog Backend" cmd /k "npm run dev"
cd ..

echo [2/2] 启动前端服务...
timeout /t 2 /nobreak >nul
cd frontend
start "Blog Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ 服务已启动！
echo 后端: http://localhost:5000
echo 前端: http://localhost:3000
echo.
pause
goto menu

:run_tests
cls
echo [1/2] 正在运行后端测试...
cd backend
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 后端测试失败！
    pause
    goto menu
)
cd ..

echo.
echo [2/2] 正在运行前端测试...
cd frontend
call npx vitest run
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 前端测试失败！
    pause
    goto menu
)
cd ..

echo.
echo 🎉 所有测试通过！
pause
goto menu

:run_test_ui
cls
echo [1/3] 准备测试数据库...
cd backend
call npm run pretest
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 数据库准备失败！
    pause
    goto menu
)

echo.
echo [2/3] 启动后端测试 UI
start "后端测试控制台" cmd /k "npm run test:ui"

echo.
echo [3/3] 启动前端测试 UI
cd ..\frontend
start "前端测试控制台" cmd /k "npm run test:ui -- --port 51205"
cd ..

echo.
echo ✅ 测试控制台已启动，请查看新窗口。
pause
goto menu

:stop_services
cls
echo [1/3] 终止 Node.js 进程...
taskkill /F /IM node.exe /T 2>nul

echo [2/3] 清理端口 3000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo [3/3] 清理端口 5000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo.
echo ✅ 所有服务已停止。
pause
goto menu
