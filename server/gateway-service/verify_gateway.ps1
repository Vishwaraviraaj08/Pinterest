try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -ContentType "application/json" -Body '{"email": "testuser_gw@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}'
    Write-Host "Success:"
    Write-Host $response
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Error Body: $($reader.ReadToEnd())"
}
