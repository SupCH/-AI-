@echo off
chcp 65001 >nul
echo ==========================================
echo        正在停止所有服务和清理进程
echo ==========================================

echo.
echo [1/3] 正在终止 Node.js 进程...
taskkill /F /IM node.exe /T 2>nul
if %ERRORLEVEL% EQU 0 (
    echo    - 已清理 Node.js 进程
) else (
    echo    - 未发现 Node.js 进程或清理失败 (正常)
)

echo.
echo [2/3] 正在清理占用端口 3000 (前端)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo.
echo [3/3] 正在清理占用端口 5000 (后端)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo.
echo ==========================================
echo           ✅ 所有服务已停止
echo ==========================================
pause
