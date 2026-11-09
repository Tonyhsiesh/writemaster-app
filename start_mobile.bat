@echo off
title WriteMaster Mobile App Server
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_mobile_web.ps1"
pause
