@echo off
setlocal EnableDelayedExpansion

REM ========= CONFIGURATION =========
REM Add the folder names of all microservices here

set SERVICES=business-account-service collaboration-service content-service gateway-service user-authentication-service

REM =================================

for %%S in (%SERVICES%) do (
    echo ------------------------------------
    echo Processing %%S ...

    REM Check if .env exists
    if exist "%%S\.env" (
        echo Updating .env in %%S ...
        echo DB_PASSWORD=root > "%%S\.env"
    ) else (
        echo No .env found in %%S 
    )

    REM Start the service after env handling
    echo Starting %%S ...
    start "%%S" cmd /k "cd %%S && mvn dependency:sources && mvn spring-boot:run"
)

echo.
echo ✅ All services processed and started.
echo.

endlocal
pause
