@echo off
title WriteMaster App - Push to GitHub
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0push_to_github.ps1"
