# Check Gateway Logs for Errors
Write-Host "Checking Gateway Service Logs..." -ForegroundColor Cyan

# First, trigger the error
Write-Host "`nTriggering registration request through gateway..." -ForegroundColor Yellow

$body = @{
    email = "testuser6@example.com"
    password = "Test123!@#"
    confirmPassword = "Test123!@#"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "Success! Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nNow checking the gateway logs for errors..." -ForegroundColor Cyan
Write-Host "Please check the terminal where gateway-service is running for error stack traces." -ForegroundColor Yellow
