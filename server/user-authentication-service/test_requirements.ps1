function Test-Registration {
    param ($url, $body, $desc)
    Write-Host "Testing: $desc"
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $body
        Write-Host "Success: $($response | ConvertTo-Json -Depth 2)"
    } catch {
        Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error Body: $($reader.ReadToEnd())"
    }
    Write-Host "--------------------------------------------------"
}

$url = "http://localhost:8081/api/auth/register"

# 1. Valid Registration (New User)
Test-Registration $url '{"email": "testuser4@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}' "Valid Registration"

# 2. Invalid Password (Too short)
Test-Registration $url '{"email": "testuser5@example.com", "password": "123", "confirmPassword": "123"}' "Invalid Password (Too short)"

# 3. Password Mismatch
Test-Registration $url '{"email": "testuser6@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#Mismatch"}' "Password Mismatch"

# 4. Missing Username (Should auto-generate)
Test-Registration $url '{"email": "testuser7@example.com", "password": "Test123!@#", "confirmPassword": "Test123!@#"}' "Missing Username"
