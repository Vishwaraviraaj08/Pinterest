# Test Gateway Registration Endpoint
Write-Host "Testing Gateway Registration Endpoint..." -ForegroundColor Cyan

$body = @{
    email = "testuser5@example.com"
    password = "Test123!@#"
    confirmPassword = "Test123!@#"
} | ConvertTo-Json

Write-Host "`nSending request to http://localhost:8080/api/auth/register" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "`nSuccess! Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "`nError occurred!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse Body:" -ForegroundColor Red
        Write-Host $responseBody
    }
}
