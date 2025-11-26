@echo off
setlocal

REM ========= CONFIGURATION =========
REM Add the folder names of all microservices here

set SERVICES=business-account-service collaboration-service content-service gateway-service user-authentication-service

REM =================================

for %%S in (%SERVICES%) do (
    echo Starting %%S ...
    start "%%S" cmd /k "cd %%S && mvn dependency:sources && mvn spring-boot:run"
)

echo.
echo All services started in separate terminals.
echo.

endlocal
pause
