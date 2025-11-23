$ErrorActionPreference = "Continue"
try {
    Write-Host "Testing Gateway registration endpoint..."
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method Post -ContentType "application/json" -Body '{"email": "testuser_gw@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}' -UseBasicParsing
    Write-Host "Success:"
    Write-Host $response.Content
} catch {
    Write-Host "Error Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error Status Description: $($_.Exception.Response.StatusDescription)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response Body:"
        Write-Host $responseBody
        $reader.Close()
    }
    
    Write-Host "`nFull Exception:"
    Write-Host $_.Exception | Format-List -Force
}
