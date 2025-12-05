# 个人博客一键启动脚本 (Windows PowerShell)
# 使用: 右键以 PowerShell 运行，或在终端执行 .\start-dev.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 个人博客开发环境启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 安装后端依赖
Write-Host ""
Write-Host "📦 安装后端依赖..." -ForegroundColor Yellow
Set-Location "$RootDir\backend"

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 后端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ 后端依赖已就绪" -ForegroundColor Green

# 初始化数据库
Write-Host ""
Write-Host "🗄️ 初始化数据库..." -ForegroundColor Yellow

npm run db:generate
npm run db:push

# 检查是否需要运行 seed
if (-not (Test-Path "prisma\dev.db")) {
    Write-Host "📝 创建初始数据..." -ForegroundColor Yellow
    npm run db:seed
}
Write-Host "✅ 数据库已就绪" -ForegroundColor Green

# 安装前端依赖
Write-Host ""
Write-Host "📦 安装前端依赖..." -ForegroundColor Yellow
Set-Location "$RootDir\frontend"

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 前端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ 前端依赖已就绪" -ForegroundColor Green

# 启动服务
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 启动开发服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📡 后端: http://localhost:5000" -ForegroundColor Magenta
Write-Host "🌐 前端: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "👤 管理员: admin@example.com / admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray
Write-Host ""

# 在后台启动后端
Set-Location "$RootDir\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

# 等待后端启动
Start-Sleep -Seconds 3

# 启动前端（前台运行）
Set-Location "$RootDir\frontend"
npm run dev
