@echo off

REM Add your microservice ports here
set PORTS=8080 8081 8082 8083 8084

for %%P in (%PORTS%) do (
    echo Killing port %%P ...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo All selected ports cleared.
pause
