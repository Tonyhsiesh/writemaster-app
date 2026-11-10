@echo off
title WriteMaster AI - Web Platform
cd /d "%~dp0"

echo ===================================================
echo     WriteMaster AI - Writing Education Platform
echo ===================================================
echo.

set NEED_SETUP=0

if not exist ".venv\Scripts\python.exe" (
    set NEED_SETUP=1
) else (
    ".venv\Scripts\python.exe" -c "import streamlit" >nul 2>&1
    if errorlevel 1 (
        set NEED_SETUP=1
    )
)

if "%NEED_SETUP%"=="1" (
    echo [1/2] Folder moved, new PC detected, or missing packages.
    echo Rebuilding virtual environment for this PC... Please wait.
    if exist ".venv" rmdir /s /q ".venv"
    python -m venv .venv
    call .venv\Scripts\activate.bat
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Installation failed. Please check your network connection.
        pause
        exit /b 1
    )
) else (
    call .venv\Scripts\activate.bat
)

echo [2/2] Launching WriteMaster Web App at http://localhost:8501 ...
echo (Press Ctrl + C in this window to stop the server)
echo.

start http://localhost:8501
python -m streamlit run app.py --server.port 8501 --server.headless false --browser.gatherUsageStats false

pause
