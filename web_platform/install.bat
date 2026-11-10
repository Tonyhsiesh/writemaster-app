@echo off
title WriteMaster AI - Environment Setup
cd /d "%~dp0"

echo ===================================================
echo     WriteMaster AI - Environment Setup Installer
echo ===================================================
echo.

echo [Step 1/3] Checking Python...
python --version
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

echo.
echo [Step 2/3] Preparing Virtual Environment (.venv)...
if exist ".venv" (
    echo Removing old/copied virtual environment...
    rmdir /s /q ".venv"
)
python -m venv .venv

echo.
echo [Step 3/3] Installing dependencies from requirements.txt...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo [WARNING] Some dependencies could not be installed. Please check network.
) else (
    echo.
    echo ===================================================
    echo   Installation successfully completed!
    echo   You can now launch the app using start.bat
    echo ===================================================
)

echo.
pause
