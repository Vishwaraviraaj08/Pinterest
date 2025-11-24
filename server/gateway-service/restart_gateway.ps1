# Restart Gateway Service Script
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  RESTARTING GATEWAY SERVICE" -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`nPlease manually stop the gateway service (Ctrl+C in the terminal)" -ForegroundColor Yellow
Write-Host "Then run this command to restart it:" -ForegroundColor Yellow
Write-Host "`n  cd 'c:\Users\vishw\OneDrive\Desktop\Pinterest - Final version\server\gateway-service'" -ForegroundColor Green
Write-Host "  mvn spring-boot:run" -ForegroundColor Green
Write-Host "`nAfter the service starts, run the test script:" -ForegroundColor Yellow
Write-Host "  .\test_gateway.ps1" -ForegroundColor Green
Write-Host "`n" -ForegroundColor Cyan
