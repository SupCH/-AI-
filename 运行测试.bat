@echo off
chcp 65001 >nul
echo ==========================================
echo       正在运行博客系统自动化测试
echo ==========================================

echo.
echo [1/2] 正在运行后端测试 (Backend Tests)...
cd backend
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] 后端测试失败！请检查日志。
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [2/2] 正在运行前端测试 (Frontend Tests)...
cd frontend
call npx vitest run
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] 前端测试失败！请检查日志。
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ==========================================
echo        🎉 所有测试通过！ (All Passed)
echo ==========================================
pause
