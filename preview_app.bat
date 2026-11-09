@echo off
title WriteMaster Mobile App - Local Preview
cd /d "%~dp0www"

echo ===================================================
echo     WriteMaster Mobile App - Live Preview Server
echo ===================================================
echo.
echo Starting local web server for Mobile Web App at:
echo http://localhost:8080
echo.
echo (You can also open this link on your phone if connected to the same Wi-Fi!)
echo Press Ctrl + C to stop the preview server.
echo.

start http://localhost:8080
python -m http.server 8080

pause
