try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register/" -Method Post -ContentType "application/json" -Body '{"email": "testuser3@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}'
    Write-Host "Success:"
    Write-Host $response
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "Error Body:"
    Write-Host $body
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method Post -ContentType "application/json" -Body '{"email": "testuser@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}'
    Write-Host "Success:"
    Write-Host $response
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "Error Body:"
    Write-Host $body
}
