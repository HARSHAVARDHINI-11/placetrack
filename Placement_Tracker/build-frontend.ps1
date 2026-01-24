# Build Frontend for Vercel Deployment

Write-Host "🚀 Building Placement Tracker Frontend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location "placement-tracker-frontend"

# Build
Write-Host "📦 Running npm build..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Build Output:" -ForegroundColor Cyan
    Write-Host "   build\"
    Write-Host ""
    Write-Host "📤 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Install Vercel CLI: npm install -g vercel"
    Write-Host "   2. Deploy: vercel"
    Write-Host "   3. Set environment variable in Vercel Dashboard:"
    Write-Host "      VITE_API_URL=http://YOUR_ORACLE_IP:8080/api"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    Write-Host ""
}

# Go back to parent directory
Set-Location ..
