# Build Backend JAR for Deployment

Write-Host "🚀 Building Placement Tracker Backend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location "Placement_Tracker"

# Clean and build
Write-Host "📦 Running Maven build..." -ForegroundColor Yellow
& "C:\Program Files\Maven\apache-maven-3.9.9\bin\mvn.cmd" clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 JAR Location:" -ForegroundColor Cyan
    Write-Host "   target\Placement_Tracker-0.0.1-SNAPSHOT.jar"
    Write-Host ""
    Write-Host "📤 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Upload this JAR to your Oracle VM"
    Write-Host "   2. Run: scp -i your-key.pem target\Placement_Tracker-0.0.1-SNAPSHOT.jar ubuntu@YOUR_IP:~/"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    Write-Host ""
}

# Go back to parent directory
Set-Location ..
